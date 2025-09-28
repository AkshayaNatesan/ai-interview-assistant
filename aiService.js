// aiService updated: try serverless OpenAI endpoints; fallback to local mock
import { v4 as uuidv4 } from 'uuid'

const questionBank = [
  { level: 'easy', text: 'What is the difference between let and const in JavaScript?', timeLimit: 20 },
  { level: 'easy', text: 'Explain the purpose of useState in React.', timeLimit: 20 },
  { level: 'medium', text: 'How would you design an authentication flow for a React SPA with a Node/Express backend?', timeLimit: 60 },
  { level: 'medium', text: 'Describe how you would optimize performance in a React app with many list items.', timeLimit: 60 },
  { level: 'hard', text: 'Given a memory leak in a Node.js service, how would you detect and fix it?', timeLimit: 120 },
  { level: 'hard', text: 'Design a real-time collaborative text editor. Outline data model and sync strategy.', timeLimit: 120 },
]

async function tryServer(action, payload) {
  try {
    const res = await fetch('/api/openai_server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    })
    if (!res.ok) throw new Error('server failed')
    const j = await res.json()
    if (j && j.ok && j.result) return j.result
    if (j && j.raw) return j.raw
  } catch (e) {
    // console.warn('Serverless OpenAI failed, fallback to mock', e)
    return null
  }
}

export default {
  async generateQuestions(role = 'Full Stack (React/Node)') {
    const server = await tryServer('generate', { role })
    if (server) {
      // server may return array or raw text; try normalize
      if (Array.isArray(server)) return server.map(q => ({ id: q.id || uuidv4(), text: q.text, level: q.level, timeLimit: q.timeLimit }))
      // if server returned raw text, fallback to mock
    }
    return questionBank.map(q => ({ id: uuidv4(), text: q.text, level: q.level, timeLimit: q.timeLimit }))
  },
  async scoreAnswer(question, answer) {
    const server = await tryServer('score', { question: question.text || question, answer, role: 'Full Stack (React/Node)' })
    if (server && typeof server.score === 'number') return Math.max(0, Math.min(10, Math.round(server.score)))
    // fallback heuristic
    const keywords = ['react','node','express','state','memory','optimi','auth','socket','websocket','jwt']
    let score = Math.min(10, Math.max(2, Math.round((answer||'').length / 40)))
    const lower = (answer || '').toLowerCase()
    for (const k of keywords) if (lower.includes(k)) score = Math.min(10, score + 2)
    return score
  },
  async summarizeCandidate(candidate) {
    const server = await tryServer('summarize', { candidate })
    if (server && server.summary) return server.summary
    const answers = candidate.session?.answers || []
    const avg = answers.length ? (answers.reduce((s,a)=>s+(a.score||6),0)/answers.length) : 0
    return `Candidate ${candidate.profile?.name || ''} answered ${answers.length} questions. Estimated score: ${Math.round(avg*10)/10}. Short notes: ${avg >=7 ? 'Strong candidate' : avg >=5 ? 'Average' : 'Needs improvement'}.`
  }
}
