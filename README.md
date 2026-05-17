<div align="center">

# 🚀 ResumeSync-AI

### Intelligent AI-Powered Resume Analysis & Interview Preparation Platform

<img src="https://img.shields.io/badge/STATUS-ACTIVE-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/SPRINGBOOT-BACKEND-green?style=for-the-badge&logo=springboot" />
<img src="https://img.shields.io/badge/REACT-FRONTEND-blue?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/GROQ-AI-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/GEMINI-INTEGRATION-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/MYSQL-DATABASE-blue?style=for-the-badge&logo=mysql" />
<img src="https://img.shields.io/badge/JWT-AUTH-red?style=for-the-badge" />

---

## ⚡ AI Career Intelligence Platform

### Optimizing resumes, generating interview preparation, ATS scoring, skill gap analysis, and smart career assistance using AI.

✨ Modern Full Stack Architecture  
✨ AI-Powered Resume Optimization  
✨ Interactive Dashboard Experience  
✨ Personalized Interview Preparation  

</div>

---

# 📖 About The Project

ResumeSync-AI is an advanced AI-powered career assistant platform designed to help students, developers, and job seekers improve their resumes and prepare for interviews intelligently.

The platform analyzes resumes using AI models, generates ATS optimization insights, compares resumes against job descriptions, identifies skill gaps, and provides personalized interview preparation.

It combines a modern futuristic frontend with a scalable Spring Boot backend and intelligent AI integrations to create a complete career growth ecosystem.

---

# ✨ Core Features

## 📄 AI Resume Analysis
- AI-powered resume evaluation
- ATS compatibility scoring
- Resume optimization suggestions
- Keyword analysis
- Smart resume insights

---

## 🎯 Job Description Matching
- Compare resume with JD
- Match percentage analysis
- Missing keyword detection
- Skill gap identification
- Optimization recommendations

---

## 🎤 AI Interview Preparation
- AI-generated interview questions
- Technical + HR preparation
- Personalized interview guidance
- Smart interview roadmap
- Career-focused preparation flow

---

## 📊 Interactive Dashboard
- Futuristic responsive UI
- Real-time analytics
- Resume activity tracking
- Personalized dashboard insights
- Dynamic AI metrics

---

## 🔐 Authentication & Security
- JWT Authentication
- Google OAuth Login
- OTP Verification System
- Password Reset Flow
- Secure API handling

---

## 🧠 AI Integrations
- Groq API Integration
- Gemini AI Integration
- Intelligent response generation
- Smart recommendation system

---

# 🖼️ Preview

## 🌌 Homepage UI


<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/8479b219-cd1b-4bb1-a145-4cdc7963a492" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/3aae43f4-6b08-4569-84d0-df41591fbc54" />


## Dashboard UI
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/dcea084f-8128-4442-85a0-a54f38096f71" />

## 🛠️ Optimize Resume
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/2c78c9d4-a4ca-4f92-a232-882db5d5dbb0" />

## Interview Prep UI
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/a0549640-4c9e-490b-91d6-db101af9686d" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d67e1804-0cb2-4a30-abf0-f91958b148c3" />

## Interview Guide UI
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/b041efbe-9d3e-4e68-941a-5bf24b065c45" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/24a4c76b-e606-4a15-878b-2a630b2dc075" />

## Skill Gap UI 
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/48e9cd3f-4b0f-4a4c-839c-54020f62d7f0" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/ef1995f3-4d31-47c0-bf1e-9ec2d564b528" />

## Cover Letter UI
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/662e91fd-8581-4a29-9071-93f12aa33e9f" />

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Modern UI Animations

---

## Backend
- Java
- Spring Boot
- Spring Security
- REST APIs
- JWT Authentication

---

## Database
- MySQL

---

## AI Services
- Groq API
- Gemini API

---

## Deployment
- Render
- Docker
- Vercel

---

# 📂 Project Structure

```bash
ResumeSync-AI/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── layouts/
│
├── src/main/java/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── configuration/
│
├── src/main/resources/
│   ├── static/
│   ├── templates/
│   └── application.properties
│
├── Dockerfile
├── pom.xml
└── render.yaml
```

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Annshikaa/ResumeSync-AI.git
cd ResumeSync-AI
```

---

# 🔧 Backend Setup

Create:

```bash
application-secret.properties
```

Add:

```properties
spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

groq.api.key=YOUR_GROQ_API_KEY
genKey=YOUR_GEMINI_API_KEY

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

Run backend:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🚀 Deployment

## Backend
- Render
- Docker Supported

## Frontend
- Vercel
- Netlify

---

# 🔒 Security Features

- JWT Authentication
- Secure OAuth2 Login
- OTP Verification
- Protected APIs
- Environment-based secret management

---

# 📈 Future Enhancements

- 🎙️ Voice-based AI Interviews
- 📹 Video Interview Analysis
- 🤖 AI Resume Builder
- 📄 Resume PDF Export
- 📊 Advanced Analytics
- 🌍 Multi-language Support

---

# 👩‍💻 Author

## Anshika Jain

🎓 Integrated MTech CSE Student — VIT Bhopal University  
💡 Passionate about AI, Full Stack Development & Intelligent Systems

## Lovesh Chittora

🎓 Btech CSE Student — VIT Bhopal University  
💡 Passionate about AI, Full Stack Development & Intelligent Systems

---

# 🔗 Connect With Me

### GitHub
https://github.com/Annshikaa

### LinkedIn
https://linkedin.com/in/anshika-jain-44672a250

### Portfolio
https://anshika-portfolio-seven.vercel.app/

---

<div align="center">

# ⭐ If you liked this project, consider starring the repository ⭐

Made with ❤️ by Anshika Jain

</div>
