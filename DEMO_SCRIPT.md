AI Interview Assistant — 2–3 Minute Demo Script (Word-for-word)

[Slide 1 — 0:00–0:08] Title
"Hi — I’m [Your Name]. This is the AI Interview Assistant, a timed, AI-driven interview tool for Full Stack roles."

[Slide 2 — 0:08–0:30] Resume Upload & Parsing
"First I upload a resume (PDF). The app extracts the candidate's Name, Email, and Phone automatically. If anything's missing, the chat prompts the candidate to fill it before starting."
*Show: Upload a resume and the parsed fields appearing.*

[Slide 3 — 0:30–1:10] Interview Flow (Interviewee)
"The interview runs 6 questions: 2 Easy, 2 Medium, 2 Hard. Each question appears one at a time with timers — 20s for easy, 60s for medium, 120s for hard. If time runs out, the system auto-submits the current answer and moves on."
*Show: Answer question 1, let another question auto-submit when timer expires.*

[Slide 4 — 1:10–1:45] Scoring & Summary
"After the final question, the AI scores each answer and produces a short summary and final score. For the demo this uses a mock scoring engine; in production it calls OpenAI via a secure serverless endpoint."
*Show: Final score and generated summary.*

[Slide 5 — 1:45–2:20] Interviewer Dashboard
"Switch to the Interviewer tab: here HR sees all candidates sorted by score, can search, and click a candidate to see detailed Q&A, per-question scores, and export a PDF summary." 
*Show: Table, search, open candidate detail, export PDF.*

[Slide 6 — 2:20–2:40] Persistence & Welcome Back
"All data persists locally using Redux Persist — if the candidate closes or refreshes, the session restores and a Welcome Back modal prompts to resume." 
*Show: Refresh mid-interview and resume.*

[Slide 7 — 2:40–3:00] Closing
"That’s the AI Interview Assistant — fast to deploy, exam-ready, and built to give consistent, objective scoring for technical interviews. I can now push this to Vercel and connect an OpenAI key for live scoring. Thanks — any questions?"
