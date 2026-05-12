ResumeSync-AI 🚀
AI-Powered Resume Analysis & Interview Preparation Platform
<p align="center">
  <img src="https://img.shields.io/badge/Java-SpringBoot-orange?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/AI-Groq%20%7C%20Gemini-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MySQL-green?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Deploy-Render-black?style=for-the-badge&logo=render" />
</p>

🌟 Overview
ResumeSync-AI is an intelligent AI-driven career assistant platform designed to help users:


Analyze resumes using AI


Improve ATS compatibility


Generate interview questions


Practice mock interviews


Detect skill gaps


Generate cover letters


Optimize resumes based on job descriptions


The platform combines modern frontend design, AI-powered backend intelligence, and real-time career assistance into one seamless experience.

✨ Features
📄 Resume Analysis


AI-powered resume evaluation


ATS optimization scoring


Resume strength analysis


Keyword matching


Smart recommendations


🎯 Job Description Matching


Compare resumes against job descriptions


Skill gap identification


Match percentage generation


Missing keyword suggestions


🎤 AI Interview Preparation


AI-generated interview questions


Technical + HR interview preparation


Personalized interview roadmap


Real-time interview guidance


🧠 Smart Career Intelligence


Skill gap analysis


Resume optimization suggestions


Cover letter generation


Career growth insights


🔐 Authentication & Security


JWT Authentication


Google OAuth Login


Secure API integration


OTP Email Verification


Password reset system


📊 Interactive Dashboard


Modern futuristic UI


Dynamic analytics


Resume tracking


User profile management


AI-driven insights dashboard



🖼️ Project Preview
Dashboard UI
<img width="100%" alt="ResumeSync Dashboard" src="https://raw.githubusercontent.com/Annshikaa/ResumeSync-AI/main/assets/dashboard-preview.png">

🛠️ Tech Stack
Frontend


React.js


Vite


Tailwind CSS


Framer Motion


Modern UI Animations


Backend


Java


Spring Boot


Spring Security


JWT Authentication


REST APIs


Database


MySQL


AI Integrations


Groq API


Gemini API


Authentication


Google OAuth2


JWT


OTP Verification


Deployment


Render


Docker



📂 Project Structure
ResumeSync-AI/│├── frontend/│   ├── src/│   ├── components/│   ├── pages/│   └── layouts/│├── src/main/java/│   ├── controller/│   ├── service/│   ├── repository/│   ├── model/│   └── configuration/│├── src/main/resources/│   ├── static/│   ├── templates/│   └── application.properties│├── Dockerfile├── pom.xml└── render.yaml

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/Annshikaa/ResumeSync-AI.gitcd ResumeSync-AI

🔧 Backend Setup
Configure Environment Variables
Create:
application-secret.properties
Add:
spring.datasource.url=YOUR_DB_URLspring.datasource.username=YOUR_DB_USERNAMEspring.datasource.password=YOUR_DB_PASSWORDgroq.api.key=YOUR_GROQ_API_KEYgenKey=YOUR_GEMINI_API_KEYspring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_IDspring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

Run Backend
./mvnw spring-boot:run
Backend runs on:
http://localhost:8080

💻 Frontend Setup
cd frontendnpm installnpm run dev
Frontend runs on:
http://localhost:5173

🔑 Environment Variables
VariableDescriptionGROQ_API_KEYGroq AI API KeyGEMINI_API_KEYGemini AI API KeyDB_URLMySQL Database URLDB_USERNAMEDatabase UsernameDB_PASSWORDDatabase PasswordGOOGLE_CLIENT_IDGoogle OAuth Client IDGOOGLE_CLIENT_SECRETGoogle OAuth Secret

🚀 Deployment
Backend Deployment


Render


Docker Supported


Frontend Deployment


Vercel


Netlify



🧠 AI Capabilities
ResumeSync-AI leverages advanced AI models for:


Resume understanding


Skill extraction


ATS scoring


Personalized interview generation


Career recommendation systems


Smart resume optimization



🔒 Security Features


JWT Authentication


OAuth2 Login


Secure Password Reset


OTP Verification


Protected API Routes



📈 Future Enhancements


🎙️ Voice-based AI interviews


📹 Video interview analysis


🤖 AI Resume Builder


📊 Advanced analytics dashboard


🌍 Multi-language support


📄 Export reports as PDF



👩‍💻 Author
Anshika Jain
🎓 BTech CSE Student — VIT Bhopal University
💡 Passionate about AI, Full Stack Development & Intelligent Systems
🔗 Connect With Me


GitHub: Annshikaa GitHub


LinkedIn: Anshika Jain LinkedIn


Portfolio: Portfolio Website



⭐ Support
If you liked this project:


⭐ Star this repository


🍴 Fork the project


🧠 Contribute improvements


🚀 Share with others



📜 License
This project is licensed under the MIT License.

<p align="center">
  Made with ❤️ by Anshika Jain
</p>
