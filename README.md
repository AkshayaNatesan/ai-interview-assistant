# AI Interview Assistant (CRISP)

An interactive web app to simulate technical interviews for Fullstack developers (React & Node.js), powered by AI. Candidates can upload resumes, take quizzes, and view a summary of their performance, while interviewers can track and manage candidate progress in real time.

---

## Features

### Candidate
- Upload resume (PDF/DOCX) and auto-extract name, email, and phone.
- Take a 6-question Fullstack quiz with timed questions.
- See real-time progress and a summary with correct/wrong answers in a pie chart.
- Download PDF summary of the quiz.

### Interviewer
- View all candidates with name, email, phone, score, and status.
- Search and filter candidates.
- Delete candidates if needed.

---

## Tech Stack
- **Frontend:** React, Ant Design, Recharts
- **State Management:** Redux
- **PDF Handling:** jsPDF
- **Resume Parsing:** pdfjs-dist, mammoth
- **Backend (optional):** Node.js/Express (if extended for persistent storage)

Logo:

![Alt text](assets/Screenshot_2025-09-28_194450-removebg-preview.png)


Working Link:

https://68da6693a331b3af90ca7046--stately-torrone-0d206c.netlify.app/
---


## Setup

1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

## How to run locally
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Deploying
- Push to GitHub and connect to Vercel (recommended). For server-side OpenAI usage, deploy `api/openai.example.js` as a serverless function and set `OPENAI_API_KEY` in environment variables.




