// Example serverless function (e.g., Vercel/Netlify) showing how to forward requests to OpenAI safely.
// DO NOT commit your real API keys to the repo. Use environment variables like process.env.OPENAI_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600
      })
    })
    const data = await r.json()
    return res.status(200).json(data)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'OpenAI request failed' })
  }
}
