# AI Interview Assistant (Completed Demo)

This repo is a deploy-ready demo of the AI Interview Assistant with the following features implemented:

- Resume upload (PDF/DOCX) and client-side parsing (extracts Name, Email, Phone heuristically)
- Missing fields prompting in the Interviewee chat before starting
- Timed interview flow: 6 questions (2 Easy, 2 Medium, 2 Hard) with timers (20s / 60s / 120s)
- Auto-submit when timer runs out; per-question scoring (mocked); final summary generation (mocked)
- Interviewer dashboard with search, sort, and candidate detail view showing answers and scores
- Persistence using redux-persist (localStorage); Welcome Back modal for unfinished sessions
- Mock AI service included; example serverless OpenAI function provided for production integration

## How to run locally
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Deploying
- Push to GitHub and connect to Vercel (recommended). For server-side OpenAI usage, deploy `api/openai.example.js` as a serverless function and set `OPENAI_API_KEY` in environment variables.

## Notes & Next steps you can ask me to do now
- Replace mock AI with OpenAI calls and tune prompts/rubrics.
- Add export-to-PDF for candidate summaries.
- Add admin auth for interviewer tab.
- Polish UI (animations, better mobile responsiveness).

Good luck — this should meet the assignment requirements for a demo-ready submission.
