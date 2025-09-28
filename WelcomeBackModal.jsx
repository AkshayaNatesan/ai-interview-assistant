import React from 'react'
import { Modal, Button } from 'antd'

export default function WelcomeBackModal({ visible, onStart, onClose }) {
  return (
    <Modal open={visible} title="Welcome back" onCancel={onClose} footer={[
      <Button key="close" onClick={onClose}>Close</Button>,
      <Button key="start" type="primary" onClick={onStart}>Resume Interview</Button>
    ]}>
      <p>We found an unfinished interview session. Resume where you left off?</p>
    </Modal>
  )
}