import React from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Typography, Button } from 'antd'
import jsPDF from 'jspdf'

const { Text } = Typography

export default function CandidateDetail({ candidateId }) {
  const candidate = useSelector(s => s.candidates.byId[candidateId])
  if (!candidate) return <div>Candidate not found</div>
  const answers = candidate.session?.answers || []

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Candidate: ${candidate.profile?.name || ''}`, 10, 20)
    doc.setFontSize(12)
    doc.text(`Email: ${candidate.profile?.email || ''}`, 10, 30)
    doc.text(`Phone: ${candidate.profile?.phone || ''}`, 10, 36)
    doc.text(`Final Score: ${candidate.final?.score ?? 'N/A'}`, 10, 46)
    doc.text('Summary:', 10, 56)
    doc.text(candidate.final?.summary || 'N/A', 10, 64, { maxWidth: 180 })
    let y = 90
    answers.forEach((a, idx) => {
      doc.text(`${idx+1}. Q: ${a.question}`, 10, y)
      y += 6
      doc.text(`   A: ${a.answer}`, 10, y, { maxWidth: 180 })
      y += 10
      doc.text(`   Score: ${a.score}`, 10, y)
      y += 10
      if (y > 270) { doc.addPage(); y = 20 }
    })
    doc.save(`${(candidate.profile?.name || 'candidate').replace(/\s+/g,'_')}_summary.pdf`)
  }

  return (
    <Card title={`${candidate.profile?.name || 'Candidate'} — Detail`} style={{ marginTop: 10 }} extra={<Button onClick={exportPDF}>Export PDF</Button>}>
      <div><Text strong>Email:</Text> {candidate.profile?.email}</div>
      <div><Text strong>Phone:</Text> {candidate.profile?.phone}</div>
      <div style={{ marginTop: 12 }}><Text strong>Final Score:</Text> {candidate.final?.score ?? 'N/A'}</div>
      <div style={{ marginTop: 12 }}><Text strong>Summary:</Text> {candidate.final?.summary ?? 'N/A'}</div>

      <List
        header={<div>Answers ({answers.length})</div>}
        dataSource={answers}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={item.question} description={<div><div><Text strong>Answer:</Text> {item.answer}</div><div><Text strong>Score:</Text> {item.score}</div></div>} />
          </List.Item>
        )}
        style={{ marginTop: 12 }}
      />
    </Card>
  )
}
