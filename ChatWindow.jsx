import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Progress, Space, Typography, message, Card } from 'antd'
import { updateSession, saveAnswer, finalizeCandidate, updateProfile } from '../store/candidatesSlice'
import aiService from '../services/aiService'

const { TextArea } = Input
const { Text } = Typography

export default function ChatWindow({ candidateId }) {
  const dispatch = useDispatch()
  const candidate = useSelector(s => s.candidates.byId[candidateId])
  const session = candidate?.session || {}
  const profile = candidate?.profile || {}
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(session.remainingSeconds || 0)
  const timerRef = useRef(null)
  const [questionIndex, setQuestionIndex] = useState(session.currentQuestion || 0)
  const questions = session.questions || []

  // If missing profile fields, render a simple prompt flow
  const missing = []
  if (!profile.name) missing.push({ key: 'name', label: 'Full name' })
  if (!profile.email) missing.push({ key: 'email', label: 'Email address' })
  if (!profile.phone) missing.push({ key: 'phone', label: 'Phone number' })

  useEffect(() => {
    // Sync local questionIndex if session changed externally
    setQuestionIndex(session.currentQuestion || 0)
  }, [session.currentQuestion])

  useEffect(() => {
    if (session.status !== 'in-progress') return
    const initial = session.remainingSeconds || (questions[questionIndex]?.timeLimit || 20)
    setTimeLeft(initial)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAutoSubmit()
          return 0
        }
        const newT = t - 1
        dispatch(updateSession({ id: candidateId, session: { remainingSeconds: newT } }))
        return newT
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [candidateId, questionIndex, session.status, questions.length])

  const handleFillProfile = (vals) => {
    dispatch(updateProfile({ id: candidateId, profile: vals }))
    // set session ready and start interview
    aiService.generateQuestions('Full Stack (React/Node)').then(questions => {
      dispatch(updateSession({ id: candidateId, session: { status: 'in-progress', questions, currentQuestion: 0, remainingSeconds: questions[0].timeLimit } }))
    })
  }

  const handleSubmit = async () => {
    if (!questions[questionIndex]) {
      message.error('No question found.')
      return
    }
    const q = questions[questionIndex]
    const answerObj = { questionId: q.id, question: q.text, answer: input, timeTaken: q.timeLimit - timeLeft }
    // score it
    const score = await aiService.scoreAnswer(q, answerObj.answer)
    answerObj.score = score
    dispatch(saveAnswer({ id: candidateId, answer: answerObj }))
    setInput('')
    const next = questionIndex + 1
    if (next >= questions.length) {
      // finalize
      const finalScore = computeFinalScore(candidate.session.answers.concat([answerObj]))
      const summary = await aiService.summarizeCandidate({ ...candidate, session: { ...candidate.session, answers: candidate.session.answers.concat([answerObj]) } })
      dispatch(finalizeCandidate({ id: candidateId, final: { score: finalScore, summary } }))
    } else {
      dispatch(updateSession({ id: candidateId, session: { currentQuestion: next, remainingSeconds: questions[next].timeLimit } }))
      setQuestionIndex(next)
    }
  }

  const handleAutoSubmit = async () => {
    const q = questions[questionIndex]
    const answerObj = { questionId: q.id, question: q.text, answer: input || '[no answer]', timeTaken: q.timeLimit }
    const score = await aiService.scoreAnswer(q, answerObj.answer)
    answerObj.score = score
    dispatch(saveAnswer({ id: candidateId, answer: answerObj }))
    setInput('')
    const next = questionIndex + 1
    if (next >= questions.length) {
      const finalScore = computeFinalScore(candidate.session.answers.concat([answerObj]))
      const summary = await aiService.summarizeCandidate({ ...candidate, session: { ...candidate.session, answers: candidate.session.answers.concat([answerObj]) } })
      dispatch(finalizeCandidate({ id: candidateId, final: { score: finalScore, summary } }))
    } else {
      dispatch(updateSession({ id: candidateId, session: { currentQuestion: next, remainingSeconds: questions[next].timeLimit } }))
      setQuestionIndex(next)
    }
  }

  const computeFinalScore = (answers) => {
    if (!answers || answers.length === 0) return 0
    const sum = answers.reduce((s,a)=> s + (a.score || 0), 0)
    return Math.round((sum / answers.length) * 10) / 10
  }

  // Render missing fields collection
  if (missing.length > 0 && session.status !== 'in-progress') {
    // simple inline form
    const [local, setLocal] = (() => {
      let state = {}
      missing.forEach(m => { state[m.key] = '' })
      return [state, (upd) => { Object.assign(state, upd) } ]
    })()
    // we will provide a very small form UI here by rendering inputs normally; but for simplicity, use prompt when button clicked
    return (
      <Card style={{ marginTop: 20 }}>
        <div>Please provide the following information before starting the interview:</div>
        {missing.map(m => (
          <div key={m.key} style={{ marginTop: 8 }}>
            <Text strong>{m.label}:</Text>
            <Input placeholder={m.label} onChange={e => local[m.key] = e.target.value} />
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => {
            // collect values from the simple local object and submit
            const vals = {}
            missing.forEach(m => { vals[m.key] = (local[m.key] || '').trim() })
            // basic validation
            const hasAll = Object.values(vals).every(v=>v)
            if (!hasAll) return message.error('Please fill all fields.')
            handleFillProfile(vals)
          }}>Submit & Start Interview</Button>
        </div>
      </Card>
    )
  }

  if (!session || !session.questions) return <div>Please start the interview from the Resume uploader or Welcome Back modal.</div>

  const q = session.questions[questionIndex]

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}><Text strong>Question {questionIndex + 1} / {questions.length}</Text></div>
      <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, minHeight: 80, marginBottom: 8 }}>{q?.text}</div>
      <Progress percent={Math.round(((q.timeLimit - (timeLeft||0)) / q.timeLimit) * 100)} />
      <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
        <TextArea rows={6} value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your answer here..." />
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <div>Time left: {timeLeft}s</div>
          <div>
            <Button onClick={handleSubmit} type="primary">Submit</Button>
          </div>
        </div>
      </Space>
    </div>
  )
}
