package com.ai.Resume.analyser.controller;

import java.io.IOException;

import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ai.Resume.analyser.service.appService;

@RestController
@RequestMapping("resumeAnalyserCore/service/v1")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.DELETE,
                RequestMethod.PUT,
                RequestMethod.OPTIONS,
                RequestMethod.HEAD
        }
)
public class appController {

    @Autowired
    private appService appServices;

    // =========================================================
    // Existing Resume ATS Analysis
    // =========================================================

    @PostMapping("/extract")
    public ResponseEntity<?> extract(
            @RequestParam String roles,
            @RequestParam MultipartFile file)
            throws TikaException, IOException, InterruptedException {

        return appServices.extract(roles, file);
    }

    // =========================================================
    // NEW FEATURE
    // Resume ↔ Job Description Match Analysis
    // =========================================================

    @PostMapping("/jd-match")
    public ResponseEntity<?> matchResumeWithJD(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription)
            throws Exception {

        return appServices.matchResumeWithJD(
                file,
                jobDescription
        );
    }

    // =========================================================
    // NEW FEATURE
    // Optimize Resume
    // =========================================================

    @PostMapping("/optimize-resume")
    public ResponseEntity<?> optimizeResume(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription) {
        return appServices.optimizeResume(file, jobDescription);
    }

    // =========================================================
    // NEW FEATURE
    // Interview Prep
    // =========================================================

    @PostMapping("/interview-prep")
    public ResponseEntity<?> interviewPrep(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription) {
        return appServices.interviewPrep(file, jobDescription);
    }

    // =========================================================
    // NEW FEATURE
    // Skill Gap Analysis
    // =========================================================

    @PostMapping("/skill-gap")
    public ResponseEntity<?> skillGapAnalysis(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription) {
        return appServices.skillGapAnalysis(file, jobDescription);
    }

    // =========================================================
    // NEW FEATURE
    // Cover Letter
    // =========================================================

    @PostMapping("/cover-letter")
    public ResponseEntity<?> generateCoverLetter(
            @RequestParam MultipartFile file,
            @RequestParam String jobDescription) {
        return appServices.generateCoverLetter(file, jobDescription);
    }

    // =========================================================
    // Previous Analysis Report
    // =========================================================

    @GetMapping("/lastReport")
    public ResponseEntity<?> lastReport() {

        return appServices.lastReport();
    }

    // =========================================================
    // Logout
    // =========================================================

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        return appServices.logout();
    }

    // =========================================================
    // Delete Account
    // =========================================================

    @PostMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount() {

        return appServices.deleteAccount();
    }

    // =========================================================
    // JWT Validation
    // =========================================================

    @PostMapping("/isValid")
    public ResponseEntity<?> tokenValidation() {

        return appServices.tokenValidation();
    }
    // =========================================================
    // NEW API: Dashboard Stats
    // =========================================================

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return appServices.getDashboardStats();
    }

    // =========================================================
    // NEW API: Interview Chatbot
    // =========================================================

    @PostMapping("/interview-chat")
    public ResponseEntity<?> interviewChat(
            @RequestParam String userMessage,
            @RequestParam String chatHistory) {
        return appServices.interviewChat(userMessage, chatHistory);
    }

    // =========================================================
    // NEW API: Interview Guide (Questions + Ideal Answers)
    // =========================================================

    @PostMapping("/interview-guide")
    public ResponseEntity<?> interviewGuide(
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String jobDescription,
            @RequestParam String difficulty) {
        return appServices.interviewGuide(file, jobDescription, difficulty);
    }

    // =========================================================
    // NEW API: AI Custom Q&A Chat
    // =========================================================

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestParam String userMessage) {
        return appServices.aiChat(userMessage);
    }
}