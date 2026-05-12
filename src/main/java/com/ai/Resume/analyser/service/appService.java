package com.ai.Resume.analyser.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.ai.Resume.analyser.model.Job;
import com.ai.Resume.analyser.model.JobSearchResponse;
import com.ai.Resume.analyser.model.jdMatchDto;
import com.ai.Resume.analyser.model.loginResponse;
import com.ai.Resume.analyser.model.previousTable;
import com.ai.Resume.analyser.model.resultsDto;
import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.prevTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import com.ai.Resume.analyser.repository.ActivityLogRepo;
import com.ai.Resume.analyser.model.ActivityLog;
import com.ai.Resume.analyser.model.DashboardStatsDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class appService {

    @Value("${genKey}")
    private String genKey;

    @Value("${groq.api.key}")
    private String groqKey;

    @Value("${application-id}")
    private String applicationId;

    @Value("${application-api-key}")
    private String applicationApiKey;

    @Autowired
    private prevTable previousTableRepo;

    @Autowired
    private usersTableRepo usersTableRepository;

    @Autowired
    private ActivityLogRepo activityLogRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private void logActivity(String username, String activityType, String details) {
        if (username == null || username.equals("anonymousUser")) return;
        try {
            ActivityLog log = new ActivityLog(username, activityType, details);
            activityLogRepo.save(log);
        } catch(Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }

    // =========================================================
    // Core AI Calling Method (Groq with Gemini Fallback)
    // =========================================================

    private String callAI(String prompt) {
        String results = null;

        // 1. Try Groq API (with 3 attempts)
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30)) // Increased timeout
                .build();

        for (int attempt = 0; attempt < 3; attempt++) { // 3 retries
            try {
                String escapedPrompt = objectMapper.writeValueAsString(prompt);
                String requestBody = "{\"model\": \"llama-3.3-70b-versatile\", \"messages\": [{\"role\": \"user\", \"content\": " +
                        escapedPrompt +
                        "}], \"temperature\": 0.2}";

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                        .header("Authorization", "Bearer " + groqKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode rootNode = objectMapper.readTree(response.body());
                    JsonNode choices = rootNode.path("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        results = choices.get(0).path("message").path("content").asText();
                        String extracted = extractJson(results);
                        if (isValidJson(extracted)) {
                            return extracted;
                        } else {
                            System.out.println("GROQ API INFO [attempt " + (attempt + 1) + "]: Invalid JSON extracted");
                        }
                    }
                } else {
                    System.out.println("GROQ API ERROR [attempt " + (attempt + 1) + "]: " + response.statusCode() + " " + response.body());
                }
            } catch (Exception e) {
                System.out.println("GROQ EXCEPTION [attempt " + (attempt + 1) + "]: " + e.getMessage());
            }
            try { Thread.sleep(1500); } catch (InterruptedException ignored) {} // delay before retry
        }

        System.out.println("Groq failed. Falling back to Gemini API...");

        // 2. Fallback to Gemini
        try {
            Client client = Client.builder().apiKey(genKey).build();
            Content content = Content.builder().parts(Part.fromText(prompt)).build();

            for (int i = 0; i < 3; i++) {
                try {
                    GenerateContentResponse response = client.models.generateContent(
                            "gemini-2.5-flash",
                            content,
                            GenerateContentConfig.builder().temperature(0.2f).build()
                    );
                    results = response.text();
                    String extracted = extractJson(results);
                    if (isValidJson(extracted)) {
                        return extracted;
                    } else {
                        System.out.println("GEMINI API INFO [attempt " + (i + 1) + "]: Invalid JSON extracted");
                    }
                } catch (Exception e) {
                    System.out.println("GEMINI API ERROR: " + e.getMessage());
                }
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        } catch (Exception e) {
            System.out.println("GEMINI INIT ERROR: " + e.getMessage());
        }

        return null; // Return null if both APIs fail after retries
    }

    private String extractJson(String results) {
        if (results == null) return null;
        
        int firstBrace = results.indexOf("{");
        int firstBracket = results.indexOf("[");
        int start = -1;
        if (firstBrace != -1 && firstBracket != -1) start = Math.min(firstBrace, firstBracket);
        else if (firstBrace != -1) start = firstBrace;
        else if (firstBracket != -1) start = firstBracket;
        
        int lastBrace = results.lastIndexOf("}");
        int lastBracket = results.lastIndexOf("]");
        int end = -1;
        if (lastBrace != -1 && lastBracket != -1) end = Math.max(lastBrace, lastBracket);
        else if (lastBrace != -1) end = lastBrace;
        else if (lastBracket != -1) end = lastBracket;

        if (start != -1 && end != -1 && end >= start) {
            return results.substring(start, end + 1);
        }
        return results;
    }

    private boolean isValidJson(String json) {
        if (json == null || json.isBlank()) return false;
        try {
            objectMapper.readTree(json);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String parseFile(MultipartFile file) throws IOException, TikaException {
        Tika tika = new Tika();
        try (ByteArrayInputStream inpfile = new ByteArrayInputStream(file.getBytes())) {
            return tika.parseToString(inpfile);
        }
    }

    // =========================================================
    // Resume ATS Analysis
    // =========================================================

    public ResponseEntity<?> extract(String roles, MultipartFile file) {
        try {
            String extracted = parseFile(file);

            String prompt = "You are an advanced ATS resume checker.\n" +
                    "Analyze this resume for role: " + roles + "\n\n" +
                    "Resume text:\n" + extracted + "\n\n" +
                    "Return ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"score\": number,\n" +
                    "\"atsoptimizationscore\": number,\n" +
                    "\"pros\": [array],\n" +
                    "\"cons\": [array],\n" +
                    "\"suggestions\": [array]\n" +
                    "}";

            String results = callAI(prompt);

            if (results == null) {
                return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            resultsDto resultsDto = objectMapper.readValue(results, resultsDto.class);

            if (resultsDto.getScore() != 0) {
                String uname = SecurityContextHolder.getContext().getAuthentication().getName();

                previousTable processedData = new previousTable(
                        uname,
                        resultsDto.getScore(),
                        resultsDto.getAtsoptimizationscore(),
                        roles,
                        resultsDto.getPros(),
                        resultsDto.getCons(),
                        resultsDto.getSuggestions()
                );

                previousTableRepo.save(processedData);

                usersTable usermod = usersTableRepository.findById(uname).orElse(null);
                if (usermod != null) {
                    usermod.setPreviousResults(true);
                    usersTableRepository.save(usermod);
                }

                logActivity(uname, "ATS_SCAN", "Analyzed resume for role: " + roles + " with Score: " + resultsDto.getScore());

                return new ResponseEntity<>("Analysed successfully", HttpStatus.OK);
            }

            return new ResponseEntity<>("Invalid document", HttpStatus.NOT_ACCEPTABLE);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error processing resume", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // Resume ↔ JD Match Analysis
    // =========================================================

    public ResponseEntity<?> matchResumeWithJD(MultipartFile file, String jobDescription) {
        try {
            String extractedResume = parseFile(file);

            String prompt = "You are an advanced ATS and recruitment AI system.\n\n" +
                    "Compare this resume with the job description.\n\n" +
                    "Return ONLY valid JSON.\n\n" +
                    "Resume:\n" + extractedResume +
                    "\n\nJob Description:\n" + jobDescription +
                    "\n\nJSON Format:\n" +
                    "{\n" +
                    "\"matchScore\": number,\n" +
                    "\"atsScore\": number,\n" +
                    "\"matchedSkills\": [array of strings],\n" +
                    "\"missingSkills\": [array of strings],\n" +
                    "\"strengths\": [array of strings],\n" +
                    "\"improvements\": [array of strings],\n" +
                    "\"recommendations\": [array of strings],\n" +
                    "\"aiSummary\": string,\n" +
                    "\"recommendedRoles\": [array of strings],\n" +
                    "\"resumeLevel\": string,\n" +
                    "\"confidenceScore\": number,\n" +
                    "\"keywordCoverage\": number,\n" +
                    "\"technicalSkillScore\": number,\n" +
                    "\"softSkillScore\": number,\n" +
                    "\"formattingScore\": number,\n" +
                    "\"recruiterReadiness\": number,\n" +
                    "\"missingKeywords\": [array of strings],\n" +
                    "\"suggestedCertifications\": [array of strings],\n" +
                    "\"suggestedProjects\": [array of strings],\n" +
                    "\"suggestedTechnologies\": [array of strings],\n" +
                    "\"careerRecommendations\": [array of strings]\n" +
                    "}";

            String results = callAI(prompt);

            if (results == null) {
                return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            jdMatchDto responseDto = objectMapper.readValue(results, jdMatchDto.class);

            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "JD_MATCH", "Matched resume with Job Description. Score: " + responseDto.getMatchScore());

            return new ResponseEntity<>(responseDto, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error matching JD", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // New Feature: Optimize Resume
    // =========================================================

    public ResponseEntity<?> optimizeResume(MultipartFile file, String jobDescription) {
        try {
            String extractedResume = parseFile(file);

            String prompt = "You are an expert resume writer and ATS optimizer. Rewrite the following resume to better match the provided Job Description naturally. " +
                    "CRITICAL: You MUST completely rewrite the Projects, Internships, and Experience sections using the STAR method (Situation, Task, Action, Result) to make them highly impactful. " +
                    "Do NOT just rewrite one bullet point. Rewrite everything. " +
                    "\n\nResume:\n" + extractedResume +
                    "\n\nJob Description:\n" + jobDescription +
                    "\n\nReturn ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"optimizedSummary\": \"string\",\n" +
                    "\"optimizedExperience\": [ { \"company\": \"string\", \"title\": \"string\", \"optimizedBullets\": [\"string\"] } ],\n" +
                    "\"optimizedProjects\": [ { \"name\": \"string\", \"optimizedBullets\": [\"string\"] } ],\n" +
                    "\"addedKeywords\": [\"string\"],\n" +
                    "\"overallImprovementAdvice\": \"string\"\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            JsonNode responseNode = objectMapper.readTree(results);

            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "OPTIMIZE_RESUME", "Optimized resume against provided Job Description.");

            return new ResponseEntity<>(responseNode, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error optimizing resume", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // New Feature: Interview Prep
    // =========================================================

    public ResponseEntity<?> interviewPrep(MultipartFile file, String jobDescription) {
        try {
            String extractedResume = parseFile(file);

            String prompt = "Generate a mock interview preparation guide based on this resume and job description.\n\n" +
                    "Resume:\n" + extractedResume +
                    "\n\nJob Description:\n" + jobDescription +
                    "\n\nReturn ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"technicalQuestions\": [ { \"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\" } ],\n" +
                    "\"hrQuestions\": [ { \"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\" } ],\n" +
                    "\"resumeBasedQuestions\": [ { \"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\" } ]\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            JsonNode responseNode = objectMapper.readTree(results);

            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "INTERVIEW_PREP", "Generated Mock Interview Guide.");

            return new ResponseEntity<>(responseNode, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error generating interview prep", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // New Feature: Skill Gap Analysis
    // =========================================================

    public ResponseEntity<?> skillGapAnalysis(MultipartFile file, String jobDescription) {
        try {
            String extractedResume = parseFile(file);

            String prompt = "Perform a deep skill gap analysis between the resume and job description, and provide a learning roadmap.\n\n" +
                    "Resume:\n" + extractedResume +
                    "\n\nJob Description:\n" + jobDescription +
                    "\n\nReturn ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"missingCriticalSkills\": [\"string\"],\n" +
                    "\"learningRoadmap\": [ { \"skill\": \"string\", \"estimatedTimeToLearn\": \"string\", \"recommendedResources\": [\"string\"] } ],\n" +
                    "\"suggestedCertifications\": [\"string\"]\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            JsonNode responseNode = objectMapper.readTree(results);

            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "SKILL_GAP", "Conducted Skill Gap Analysis and mapped learning roadmap.");

            return new ResponseEntity<>(responseNode, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error generating skill gap analysis", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // New Feature: Cover Letter
    // =========================================================

    public ResponseEntity<?> generateCoverLetter(MultipartFile file, String jobDescription) {
        try {
            String extractedResume = parseFile(file);

            String prompt = "Write a professional, highly tailored cover letter based on this resume and job description.\n\n" +
                    "Resume:\n" + extractedResume +
                    "\n\nJob Description:\n" + jobDescription +
                    "\n\nReturn ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"coverLetterContent\": \"string (use \\n for newlines)\",\n" +
                    "\"tone\": \"string\"\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            JsonNode responseNode = objectMapper.readTree(results);

            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "COVER_LETTER", "Generated AI Cover Letter.");

            return new ResponseEntity<>(responseNode, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error generating cover letter", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // Previous Report
    // =========================================================

    public ResponseEntity<?> lastReport() {
        previousTable previousTable = previousTableRepo.findById(SecurityContextHolder.getContext().getAuthentication().getName()).orElse(null);

        if (previousTable != null) {
            RestTemplate restTemplate = new RestTemplate();
            List<Job> jobs = null;
            String url = "https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=" + applicationId + "&app_key=" + applicationApiKey + "&what=" + previousTable.getRoles() + "&where=tamilnadu&content-type=application/json";

            try {
                JobSearchResponse response = restTemplate.getForObject(url, JobSearchResponse.class);
                if (response != null) jobs = response.getResults();
            } catch (Exception e) {
                System.out.println("Job Fetch Failed: " + e.getMessage());
            }

            resultsDto resultsDto = new resultsDto(
                    previousTable.getScore(),
                    previousTable.getAtsoptimizationscore(),
                    previousTable.getPros(),
                    previousTable.getCons(),
                    previousTable.getSuggestions(),
                    jobs
            );

            return new ResponseEntity<>(resultsDto, HttpStatus.OK);
        }

        return new ResponseEntity<>("No previous Analysis", HttpStatus.NOT_FOUND);
    }

    // =========================================================
    // Logout
    // =========================================================

    public ResponseEntity<?> logout() {
        HttpHeaders headers = new HttpHeaders();
        ResponseCookie cookie = ResponseCookie.from("entrypasstoken", "").httpOnly(true).secure(false).sameSite("Strict").maxAge(0).path("/").build();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
        return new ResponseEntity<>("Successfully loggedOut", headers, HttpStatus.OK);
    }

    // =========================================================
    // Delete Account
    // =========================================================

    public ResponseEntity<?> deleteAccount() {
        try {
            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            usersTableRepository.deleteById(uname);
            previousTableRepo.deleteById(uname);

            HttpHeaders headers = new HttpHeaders();
            ResponseCookie cookie = ResponseCookie.from("entrypasstoken", "").httpOnly(true).secure(false).sameSite("Strict").maxAge(0).path("/").build();
            headers.add(HttpHeaders.SET_COOKIE, cookie.toString());

            return new ResponseEntity<>("Account deleted successfully", headers, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete", HttpStatus.NOT_FOUND);
        }
    }

    // =========================================================
    // JWT Validation
    // =========================================================

    public ResponseEntity<?> tokenValidation() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        usersTable user = usersTableRepository.findById(name).orElse(null);
        if (user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);

        loginResponse loginRes = new loginResponse(user.getUsername(), user.getPreviousResults());
        return new ResponseEntity<>(loginRes, HttpStatus.OK);
    }

    // =========================================================
    // NEW API: Dashboard Stats
    // =========================================================

    public ResponseEntity<?> getDashboardStats() {
        String uname = SecurityContextHolder.getContext().getAuthentication().getName();
        if (uname == null || uname.equals("anonymousUser")) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        DashboardStatsDto stats = new DashboardStatsDto();
        
        previousTable prev = previousTableRepo.findById(uname).orElse(null);
        if (prev != null) {
            stats.setLatestScore(prev.getScore());
            stats.setLatestAtsScore(prev.getAtsoptimizationscore());
            stats.setTotalResumesAnalyzed(1);
        } else {
            stats.setLatestScore(0);
            stats.setLatestAtsScore(0);
            stats.setTotalResumesAnalyzed(0);
        }

        List<ActivityLog> activities = activityLogRepo.findTop10ByUsernameOrderByTimestampDesc(uname);
        stats.setRecentActivities(activities);

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    // =========================================================
    // NEW API: Interview Guide (Questions + Answers by Difficulty)
    // =========================================================

    public ResponseEntity<?> interviewGuide(MultipartFile file, String jobDescription, String difficulty) {
        try {
            String resumeText = "No resume provided. Generate questions based on the job description only.";
            if (file != null && !file.isEmpty()) {
                resumeText = parseFile(file);
            }

            String prompt = "You are an expert interview coach. Generate a comprehensive interview preparation guide.\n\n" +
                    "Difficulty Level: " + difficulty.toUpperCase() + "\n\n" +
                    "Resume Context:\n" + resumeText + "\n\n" +
                    "Job Description:\n" + jobDescription + "\n\n" +
                    "Generate exactly:\n" +
                    "- 5 HR behavioral questions\n" +
                    "- 6 technical questions calibrated for difficulty '" + difficulty + "'\n" +
                    "- 4 project or situational questions\n\n" +
                    "Difficulty calibration: beginner = conceptual/basic; medium = applied/design; hard = system design/advanced.\n\n" +
                    "Return ONLY valid JSON in this exact format:\n" +
                    "{\n" +
                    "\"hrQuestions\": [{\"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\"}],\n" +
                    "\"technicalQuestions\": [{\"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\"}],\n" +
                    "\"projectQuestions\": [{\"question\": \"string\", \"idealAnswer\": \"string\", \"tips\": \"string\"}]\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            try {
                JsonNode responseNode = objectMapper.readTree(results);
                String uname = SecurityContextHolder.getContext().getAuthentication().getName();
                logActivity(uname, "INTERVIEW_GUIDE", "Generated Interview Guide. Difficulty: " + difficulty);
                return new ResponseEntity<>(responseNode, HttpStatus.OK);
            } catch (Exception parseEx) {
                System.err.println("Interview guide JSON parse error: " + parseEx.getMessage());
                return new ResponseEntity<>("Invalid AI response format", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error generating interview guide", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // NEW API: AI Custom Q&A Chat (unlimited conversational)
    // =========================================================

    public ResponseEntity<?> aiChat(String userMessage) {
        try {
            String prompt = "You are a knowledgeable AI assistant specializing in interview preparation, technical concepts, " +
                    "programming, computer science, data science, system design, and career advice. " +
                    "Answer the user's question clearly, accurately, and conversationally. " +
                    "Use examples and structure your answer well. Be concise yet thorough.\n\n" +
                    "User Question: " + userMessage + "\n\n" +
                    "Return ONLY valid JSON: {\"response\": \"your detailed answer here\"}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            try {
                JsonNode responseNode = objectMapper.readTree(results);
                String uname = SecurityContextHolder.getContext().getAuthentication().getName();
                logActivity(uname, "AI_CHAT", "Asked: " + userMessage.substring(0, Math.min(userMessage.length(), 100)));
                return new ResponseEntity<>(responseNode, HttpStatus.OK);
            } catch (Exception parseEx) {
                System.err.println("AI chat JSON parse error: " + parseEx.getMessage());
                return new ResponseEntity<>("Invalid AI response format", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error processing chat", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================
    // NEW API: Interview Chatbot
    // =========================================================

    public ResponseEntity<?> interviewChat(String userMessage, String chatHistory) {
        try {
            String prompt = "You are an expert technical and HR interviewer. Evaluate the user's latest message. " +
                    "If the user is answering a question, rate their confidence, technical correctness, and clarity, then provide a brief feedback and ask a follow-up question. " +
                    "If the user asks a question, answer it concisely. " +
                    "Maintain the persona of a professional AI interviewer. Keep responses concise.\n\n" +
                    "Chat History:\n" + chatHistory + "\n\n" +
                    "User's Latest Message: " + userMessage + "\n\n" +
                    "Return ONLY valid JSON in this format:\n" +
                    "{\n" +
                    "\"aiResponse\": \"string (your conversational reply and next question)\",\n" +
                    "\"evaluationScore\": number (out of 100, if applicable. 0 if not evaluating an answer),\n" +
                    "\"feedback\": \"string (feedback on their answer, if applicable)\"\n" +
                    "}";

            String results = callAI(prompt);
            if (results == null) return new ResponseEntity<>("AI API Failed", HttpStatus.INTERNAL_SERVER_ERROR);

            JsonNode responseNode = objectMapper.readTree(results);
            
            String uname = SecurityContextHolder.getContext().getAuthentication().getName();
            logActivity(uname, "INTERVIEW_CHAT", "Interacted with Mock Interviewer AI.");
            
            return new ResponseEntity<>(responseNode, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error processing chat", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}