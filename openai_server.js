// Serverless OpenAI handler for Generate / Score / Summarize
// Deploy this as a serverless function (Vercel, Netlify functions, etc.)
// Set environment variable OPENAI_API_KEY in your deployment settings.
const fetch = require('node-fetch')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const { action, payload } = req.body || {}
  if (!action) return res.status(400).json({ error: 'Missing action' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })

  try {
    let prompt, messages
    if (action === 'generate') {
      // Generate 6 interview questions for Full Stack (React/Node)
      prompt = `You are an expert hiring manager and interviewer for Full Stack (React/Node) roles. Produce exactly 6 interview questions in JSON array format: first 2 EASY, next 2 MEDIUM, last 2 HARD. Each item must have fields: id, text, level (easy|medium|hard), timeLimit (seconds). Respond ONLY with valid JSON.`
      messages = [{ role: 'user', content: prompt }]
    } else if (action === 'score') {
      const { question, answer, role } = payload || {}
      prompt = `You are an objective technical interviewer scoring answers on a 0-10 integer scale. Give a JSON object: { score: <0-10 integer>, reasoning: <short reasoning (max 40 words)> }. Question: "${question}". Candidate answer: "${answer}". Role: "${role || 'Full Stack (React/Node)'}".`
      messages = [{ role: 'user', content: prompt }]
    } else if (action === 'summarize') {
      const { candidate } = payload || {}
      prompt = `You are an interviewer summarizing a candidate. Return JSON: { summary: string (max 100 words), finalScore: number (0-10) }. Candidate profile: ${JSON.stringify(candidate.profile || {})}. Answers: ${JSON.stringify(candidate.session?.answers || [])}.`
      messages = [{ role: 'user', content: prompt }]
    } else {
      return res.status(400).json({ error: 'Unknown action' })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 800,
        temperature: 0.2
      })
    })

    const data = await response.json()
    if (!data.choices || !data.choices.length) return res.status(500).json({ error: 'No response from OpenAI', raw: data })
    const text = data.choices[0].message.content
    // Try to parse JSON from the model's response
    try {
      const parsed = JSON.parse(text)
      return res.status(200).json({ ok: true, result: parsed })
    } catch (e) {
      // If not JSON, return raw text
      return res.status(200).json({ ok: true, raw: text })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'OpenAI request failed', detail: err.message })
  }
}
