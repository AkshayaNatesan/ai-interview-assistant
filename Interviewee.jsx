// // // // // // // // // // // // import React, { useEffect, useState } from 'react'
// // // // // // // // // // // // import { useDispatch, useSelector } from 'react-redux'
// // // // // // // // // // // // import { Button, Card, Input, Space, Modal, Progress, Typography } from 'antd'
// // // // // // // // // // // // import ResumeUploader from './ResumeUploader'
// // // // // // // // // // // // import ChatWindow from './ChatWindow'
// // // // // // // // // // // // import WelcomeBackModal from './WelcomeBackModal'
// // // // // // // // // // // // import { createCandidate, updateProfile, updateSession } from '../store/candidatesSlice'
// // // // // // // // // // // // import aiService from '../services/aiService'
// // // // // // // // // // // // import { v4 as uuidv4 } from 'uuid'

// // // // // // // // // // // // const { Text } = Typography

// // // // // // // // // // // // export default function Interviewee() {
// // // // // // // // // // // //   const dispatch = useDispatch()
// // // // // // // // // // // //   const candidates = useSelector(s => s.candidates)
// // // // // // // // // // // //   const [activeId, setActiveId] = useState(null)
// // // // // // // // // // // //   const [parsedProfile, setParsedProfile] = useState(null)
// // // // // // // // // // // //   const [resumeText, setResumeText] = useState('')
// // // // // // // // // // // //   const [showWelcome, setShowWelcome] = useState(false)

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     // Show welcome back if an in-progress or paused session exists
// // // // // // // // // // // //     const ids = candidates.allIds || []
// // // // // // // // // // // //     const inProgress = ids.find(id => {
// // // // // // // // // // // //       const s = candidates.byId[id].session
// // // // // // // // // // // //       return s?.status === 'in-progress' || s?.status === 'paused' || s?.status === 'needs-info'
// // // // // // // // // // // //     })
// // // // // // // // // // // //     if (inProgress) {
// // // // // // // // // // // //       setActiveId(inProgress)
// // // // // // // // // // // //       setShowWelcome(true)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }, [candidates.allIds.length])

// // // // // // // // // // // //   const handleParsed = (fields, text) => {
// // // // // // // // // // // //     setParsedProfile(fields)
// // // // // // // // // // // //     setResumeText(text)
// // // // // // // // // // // //     // create candidate record with generated id so we can select it immediately
// // // // // // // // // // // //     const id = uuidv4()
// // // // // // // // // // // //     const initialSession = { status: (fields.name && fields.email && fields.phone) ? 'ready' : 'needs-info', currentQuestion: 0, answers: [], remainingSeconds: null, questions: [] }
// // // // // // // // // // // //     dispatch(createCandidate({ id, profile: fields, session: initialSession }))
// // // // // // // // // // // //     setActiveId(id)
// // // // // // // // // // // //     // if ready, generate questions immediately
// // // // // // // // // // // //     if (initialSession.status === 'ready') {
// // // // // // // // // // // //       startInterview(id)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const startInterview = async (id) => {
// // // // // // // // // // // //     // generate questions and set session to in-progress
// // // // // // // // // // // //     const questions = await aiService.generateQuestions('Full Stack (React/Node)')
// // // // // // // // // // // //     dispatch(updateSession({ id, session: { status: 'in-progress', questions, currentQuestion: 0, remainingSeconds: questions[0].timeLimit } }))
// // // // // // // // // // // //     setShowWelcome(false)
// // // // // // // // // // // //   }

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <Card>
// // // // // // // // // // // //       <Space direction="vertical" style={{ width: '100%' }}>
// // // // // // // // // // // //         <ResumeUploader onParsed={handleParsed} />
// // // // // // // // // // // //         <Text type="secondary">Parsed profile preview: {parsedProfile ? JSON.stringify(parsedProfile) : 'No resume yet'}</Text>

// // // // // // // // // // // //         <WelcomeBackModal visible={showWelcome} onClose={() => setShowWelcome(false)} onStart={() => startInterview(activeId)} />

// // // // // // // // // // // //         {activeId ? (
// // // // // // // // // // // //           <ChatWindow candidateId={activeId} />
// // // // // // // // // // // //         ) : (
// // // // // // // // // // // //           <div style={{ marginTop: 20 }}>
// // // // // // // // // // // //             <Text>No active candidate. Upload a resume to start.</Text>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         )}
// // // // // // // // // // // //       </Space>
// // // // // // // // // // // //     </Card>
// // // // // // // // // // // //   )
// // // // // // // // // // // // }


// // // // // // // // // // // import React, { useState } from "react";
// // // // // // // // // // // import { Upload, message, Button, Input, Card, Spin, Progress } from "antd";
// // // // // // // // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";
// // // // // // // // // // // import aiService from "../services/aiService";

// // // // // // // // // // // const { Dragger } = Upload;

// // // // // // // // // // // export default function Interviewee() {
// // // // // // // // // // //   const [fields, setFields] = useState({});
// // // // // // // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // // // //   const [quizData, setQuizData] = useState(null); // { profile, questions }
// // // // // // // // // // //   const [index, setIndex] = useState(0);
// // // // // // // // // // //   const [answers, setAnswers] = useState([]);
// // // // // // // // // // //   const [currentAnswer, setCurrentAnswer] = useState("");

// // // // // // // // // // //   /** ----------------- Resume Handling ----------------- **/
// // // // // // // // // // //   const handleFile = async (file) => {
// // // // // // // // // // //     if (!file) return false;
// // // // // // // // // // //     try {
// // // // // // // // // // //       const fileType = file.name.split(".").pop().toLowerCase();
// // // // // // // // // // //       let text = "";
// // // // // // // // // // //       if (fileType === "pdf") text = await extractTextFromPDF(file);
// // // // // // // // // // //       else if (fileType === "docx") text = await extractTextFromDocx(file);
// // // // // // // // // // //       else {
// // // // // // // // // // //         message.error("Unsupported file type");
// // // // // // // // // // //         return false;
// // // // // // // // // // //       }

// // // // // // // // // // //       if (!text.trim()) {
// // // // // // // // // // //         message.error("Failed to extract text from resume");
// // // // // // // // // // //         return false;
// // // // // // // // // // //       }

// // // // // // // // // // //       const extracted = extractFields(text);
// // // // // // // // // // //       setFields(extracted);
// // // // // // // // // // //       setShowStartButton(true);
// // // // // // // // // // //       message.success("Resume parsed successfully!");
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       console.error(err);
// // // // // // // // // // //       message.error("Error parsing resume");
// // // // // // // // // // //     }
// // // // // // // // // // //     return false;
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleFieldChange = (key, value) =>
// // // // // // // // // // //     setFields((prev) => ({ ...prev, [key]: value }));

// // // // // // // // // // //   /** ----------------- Quiz Handling ----------------- **/
// // // // // // // // // // //   const handleStartQuiz = async () => {
// // // // // // // // // // //     if (!fields.name || !fields.name.trim()) {
// // // // // // // // // // //       message.error("Name is required");
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     setLoading(true);
// // // // // // // // // // //     try {
// // // // // // // // // // //       // Generate questions (fallback to local bank)
// // // // // // // // // // //       const questions = await aiService.generateQuestions();
// // // // // // // // // // //       setQuizData({ profile: fields, questions });
// // // // // // // // // // //       setIndex(0);
// // // // // // // // // // //       setAnswers([]);
// // // // // // // // // // //       setCurrentAnswer("");
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       console.error("Error generating quiz:", err);
// // // // // // // // // // //       message.error("Failed to start quiz");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleNext = async () => {
// // // // // // // // // // //     const q = quizData.questions[index];
// // // // // // // // // // //     const score = await aiService.scoreAnswer(q, currentAnswer);

// // // // // // // // // // //     const updatedAnswers = [...answers, { question: q, answer: currentAnswer, score }];
// // // // // // // // // // //     setAnswers(updatedAnswers);
// // // // // // // // // // //     setCurrentAnswer("");

// // // // // // // // // // //     if (index + 1 < quizData.questions.length) setIndex(index + 1);
// // // // // // // // // // //     else {
// // // // // // // // // // //       const summary = await aiService.summarizeCandidate({
// // // // // // // // // // //         profile: quizData.profile,
// // // // // // // // // // //         session: { answers: updatedAnswers },
// // // // // // // // // // //       });
// // // // // // // // // // //       message.success(summary, 15);
// // // // // // // // // // //       // Reset to uploader for next candidate
// // // // // // // // // // //       setQuizData(null);
// // // // // // // // // // //       setShowStartButton(false);
// // // // // // // // // // //       setFields({});
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   /** ----------------- Render ----------------- **/
// // // // // // // // // // //   // Show quiz
// // // // // // // // // // //   if (quizData) {
// // // // // // // // // // //     const q = quizData.questions[index];
// // // // // // // // // // //     return (
// // // // // // // // // // //       <Card
// // // // // // // // // // //         title={`Question ${index + 1} / ${quizData.questions.length}`}
// // // // // // // // // // //         style={{ maxWidth: 600, margin: "0 auto" }}
// // // // // // // // // // //       >
// // // // // // // // // // //         <p>{q.text}</p>
// // // // // // // // // // //         <Input.TextArea
// // // // // // // // // // //           value={currentAnswer}
// // // // // // // // // // //           onChange={(e) => setCurrentAnswer(e.target.value)}
// // // // // // // // // // //           rows={4}
// // // // // // // // // // //           style={{ marginBottom: 10 }}
// // // // // // // // // // //         />
// // // // // // // // // // //         <Progress
// // // // // // // // // // //           percent={Math.round((index / quizData.questions.length) * 100)}
// // // // // // // // // // //           style={{ marginBottom: 10 }}
// // // // // // // // // // //         />
// // // // // // // // // // //         <Button type="primary" onClick={handleNext}>
// // // // // // // // // // //           Submit & Next
// // // // // // // // // // //         </Button>
// // // // // // // // // // //       </Card>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   // Show resume uploader
// // // // // // // // // // //   return (
// // // // // // // // // // //     <div style={{ maxWidth: 600, margin: "0 auto" }}>
// // // // // // // // // // //       {!showStartButton && (
// // // // // // // // // // //         <Dragger
// // // // // // // // // // //           accept=".pdf,.docx"
// // // // // // // // // // //           beforeUpload={handleFile}
// // // // // // // // // // //           multiple={false}
// // // // // // // // // // //           showUploadList={false}
// // // // // // // // // // //           style={{ padding: 20 }}
// // // // // // // // // // //         >
// // // // // // // // // // //           <p className="ant-upload-drag-icon">
// // // // // // // // // // //             <InboxOutlined />
// // // // // // // // // // //           </p>
// // // // // // // // // // //           <p className="ant-upload-text">Click or drag resume here</p>
// // // // // // // // // // //           <p className="ant-upload-hint">Supports PDF or DOCX only</p>
// // // // // // // // // // //         </Dragger>
// // // // // // // // // // //       )}

// // // // // // // // // // //       {showStartButton && (
// // // // // // // // // // //         <Card title="Extracted Details" style={{ marginTop: 20 }}>
// // // // // // // // // // //           <Input
// // // // // // // // // // //             placeholder="Name"
// // // // // // // // // // //             value={fields.name || ""}
// // // // // // // // // // //             onChange={(e) => handleFieldChange("name", e.target.value)}
// // // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // // //           />
// // // // // // // // // // //           <Input
// // // // // // // // // // //             placeholder="Email"
// // // // // // // // // // //             value={fields.email || ""}
// // // // // // // // // // //             onChange={(e) => handleFieldChange("email", e.target.value)}
// // // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // // //           />
// // // // // // // // // // //           <Input
// // // // // // // // // // //             placeholder="Phone"
// // // // // // // // // // //             value={fields.phone || ""}
// // // // // // // // // // //             onChange={(e) => handleFieldChange("phone", e.target.value)}
// // // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // // //           />
// // // // // // // // // // //           <Button type="primary" onClick={handleStartQuiz} disabled={loading}>
// // // // // // // // // // //             {loading ? <Spin /> : "Start Test"}
// // // // // // // // // // //           </Button>
// // // // // // // // // // //         </Card>
// // // // // // // // // // //       )}
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // }


// // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // import { Upload, message, Button, Card, Spin, Progress, Radio } from "antd";
// // // // // // // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";
// // // // // // // // // // import aiService from "../services/aiService";
// // // // // // // // // // import jsPDF from "jspdf";

// // // // // // // // // // const { Dragger } = Upload;

// // // // // // // // // // export default function Interviewee() {
// // // // // // // // // //   const [fields, setFields] = useState({});
// // // // // // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // // //   const [quizData, setQuizData] = useState(null); // { profile, questions }
// // // // // // // // // //   const [index, setIndex] = useState(0);
// // // // // // // // // //   const [answers, setAnswers] = useState([]);
// // // // // // // // // //   const [currentAnswer, setCurrentAnswer] = useState(null);

// // // // // // // // // //   const [timer, setTimer] = useState(0);
// // // // // // // // // //   const [timeInterval, setTimeInterval] = useState(null);

// // // // // // // // // //   /** ----------------- Resume Handling ----------------- **/
// // // // // // // // // //   const handleFile = async (file) => {
// // // // // // // // // //     if (!file) return false;
// // // // // // // // // //     try {
// // // // // // // // // //       const fileType = file.name.split(".").pop().toLowerCase();
// // // // // // // // // //       let text = "";
// // // // // // // // // //       if (fileType === "pdf") text = await extractTextFromPDF(file);
// // // // // // // // // //       else if (fileType === "docx") text = await extractTextFromDocx(file);
// // // // // // // // // //       else {
// // // // // // // // // //         message.error("Unsupported file type");
// // // // // // // // // //         return false;
// // // // // // // // // //       }
// // // // // // // // // //       if (!text.trim()) {
// // // // // // // // // //         message.error("Failed to extract text from resume");
// // // // // // // // // //         return false;
// // // // // // // // // //       }
// // // // // // // // // //       const extracted = extractFields(text);
// // // // // // // // // //       setFields(extracted);
// // // // // // // // // //       setShowStartButton(true);
// // // // // // // // // //       message.success("Resume parsed successfully!");
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error(err);
// // // // // // // // // //       message.error("Error parsing resume");
// // // // // // // // // //     }
// // // // // // // // // //     return false;
// // // // // // // // // //   };

// // // // // // // // // //   const handleStartQuiz = async () => {
// // // // // // // // // //     if (!fields.name || !fields.name.trim()) {
// // // // // // // // // //       message.error("Name is required");
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     setLoading(true);
// // // // // // // // // //     try {
// // // // // // // // // //       // Generate MCQ questions
// // // // // // // // // //       const questionsRaw = await aiService.generateQuestions();
// // // // // // // // // //       // Convert to MCQ format
// // // // // // // // // //       const questions = questionsRaw.map((q) => ({
// // // // // // // // // //         ...q,
// // // // // // // // // //         options: generateMCQOptions(q.text),
// // // // // // // // // //       }));
// // // // // // // // // //       setQuizData({ profile: fields, questions });
// // // // // // // // // //       setIndex(0);
// // // // // // // // // //       setAnswers([]);
// // // // // // // // // //       setCurrentAnswer(null);
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error(err);
// // // // // // // // // //       message.error("Failed to start quiz");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   /** ----------------- Timer Effect ----------------- **/
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     if (!quizData) return;
// // // // // // // // // //     setTimer(quizData.questions[index].timeLimit || 30); // default 30s
// // // // // // // // // //     if (timeInterval) clearInterval(timeInterval);
// // // // // // // // // //     const interval = setInterval(() => {
// // // // // // // // // //       setTimer((t) => {
// // // // // // // // // //         if (t <= 1) {
// // // // // // // // // //           clearInterval(interval);
// // // // // // // // // //           handleNext(); // auto move to next question
// // // // // // // // // //           return 0;
// // // // // // // // // //         }
// // // // // // // // // //         return t - 1;
// // // // // // // // // //       });
// // // // // // // // // //     }, 1000);
// // // // // // // // // //     setTimeInterval(interval);
// // // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // // //     // eslint-disable-next-line
// // // // // // // // // //   }, [index, quizData]);

// // // // // // // // // //   /** ----------------- Next Question ----------------- **/
// // // // // // // // // //   const handleNext = async () => {
// // // // // // // // // //     if (!quizData) return;
// // // // // // // // // //     const q = quizData.questions[index];
// // // // // // // // // //     const score = await aiService.scoreAnswer(q, currentAnswer || "");
// // // // // // // // // //     const updatedAnswers = [
// // // // // // // // // //       ...answers,
// // // // // // // // // //       { question: q, answer: currentAnswer || "No answer", score },
// // // // // // // // // //     ];
// // // // // // // // // //     setAnswers(updatedAnswers);
// // // // // // // // // //     setCurrentAnswer(null);

// // // // // // // // // //     if (index + 1 < quizData.questions.length) setIndex(index + 1);
// // // // // // // // // //     else {
// // // // // // // // // //       clearInterval(timeInterval);
// // // // // // // // // //       generateScorecard(updatedAnswers, quizData.profile.name);
// // // // // // // // // //       message.success("Quiz completed! Scorecard generated.", 10);
// // // // // // // // // //       // Reset after completion if needed
// // // // // // // // // //       setQuizData(null);
// // // // // // // // // //       setShowStartButton(false);
// // // // // // // // // //       setFields({});
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   /** ----------------- Generate MCQ Options ----------------- **/
// // // // // // // // // //   const generateMCQOptions = (questionText) => {
// // // // // // // // // //     // Simple mock: correct answer = first option, plus 3 random fillers
// // // // // // // // // //     const fillers = [
// // // // // // // // // //       "Option A", "Option B", "Option C", "Option D", "Option E",
// // // // // // // // // //       "Not Sure", "Cannot Answer", "Depends", "I don't know"
// // // // // // // // // //     ];
// // // // // // // // // //     const options = [questionText]; // treat question as correct answer
// // // // // // // // // //     while (options.length < 4) {
// // // // // // // // // //       const choice = fillers[Math.floor(Math.random() * fillers.length)];
// // // // // // // // // //       if (!options.includes(choice)) options.push(choice);
// // // // // // // // // //     }
// // // // // // // // // //     return shuffleArray(options);
// // // // // // // // // //   };

// // // // // // // // // //   const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

// // // // // // // // // //   /** ----------------- Scorecard PDF ----------------- **/
// // // // // // // // // //   const generateScorecard = (answers, candidateName) => {
// // // // // // // // // //     const doc = new jsPDF();
// // // // // // // // // //     doc.setFontSize(16);
// // // // // // // // // //     doc.text(`Scorecard for ${candidateName}`, 20, 20);
// // // // // // // // // //     doc.setFontSize(12);

// // // // // // // // // //     answers.forEach((a, i) => {
// // // // // // // // // //       doc.text(
// // // // // // // // // //         `${i + 1}. ${a.question.text} - Your Answer: ${a.answer} - Score: ${a.score}`,
// // // // // // // // // //         20,
// // // // // // // // // //         30 + i * 10
// // // // // // // // // //       );
// // // // // // // // // //     });
// // // // // // // // // //     const total = answers.reduce((sum, a) => sum + a.score, 0);
// // // // // // // // // //     doc.text(`Total Score: ${total}`, 20, 40 + answers.length * 10);
// // // // // // // // // //     doc.save(`${candidateName}_Scorecard.pdf`);
// // // // // // // // // //   };

// // // // // // // // // //   /** ----------------- Render ----------------- **/
// // // // // // // // // //   // Quiz UI
// // // // // // // // // //   if (quizData) {
// // // // // // // // // //     const q = quizData.questions[index];
// // // // // // // // // //     return (
// // // // // // // // // //       <Card
// // // // // // // // // //         title={`Question ${index + 1} / ${quizData.questions.length}`}
// // // // // // // // // //         style={{ maxWidth: 600, margin: "0 auto" }}
// // // // // // // // // //       >
// // // // // // // // // //         <p>{q.text}</p>
// // // // // // // // // //         <Radio.Group
// // // // // // // // // //           onChange={(e) => setCurrentAnswer(e.target.value)}
// // // // // // // // // //           value={currentAnswer}
// // // // // // // // // //           style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
// // // // // // // // // //         >
// // // // // // // // // //           {q.options.map((opt, i) => (
// // // // // // // // // //             <Radio key={i} value={opt} style={{ marginBottom: 5 }}>
// // // // // // // // // //               {opt}
// // // // // // // // // //             </Radio>
// // // // // // // // // //           ))}
// // // // // // // // // //         </Radio.Group>
// // // // // // // // // //         <Progress
// // // // // // // // // //           percent={Math.round((index / quizData.questions.length) * 100)}
// // // // // // // // // //           style={{ marginBottom: 10 }}
// // // // // // // // // //         />
// // // // // // // // // //         <p>Time Remaining: {timer}s</p>
// // // // // // // // // //         <Button type="primary" onClick={handleNext}>
// // // // // // // // // //           Submit & Next
// // // // // // // // // //         </Button>
// // // // // // // // // //       </Card>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   // Resume uploader
// // // // // // // // // //   return (
// // // // // // // // // //     <div style={{ maxWidth: 600, margin: "0 auto" }}>
// // // // // // // // // //       {!showStartButton && (
// // // // // // // // // //         <Dragger
// // // // // // // // // //           accept=".pdf,.docx"
// // // // // // // // // //           beforeUpload={handleFile}
// // // // // // // // // //           multiple={false}
// // // // // // // // // //           showUploadList={false}
// // // // // // // // // //           style={{ padding: 20 }}
// // // // // // // // // //         >
// // // // // // // // // //           <p className="ant-upload-drag-icon">
// // // // // // // // // //             <InboxOutlined />
// // // // // // // // // //           </p>
// // // // // // // // // //           <p className="ant-upload-text">Click or drag resume here</p>
// // // // // // // // // //           <p className="ant-upload-hint">Supports PDF or DOCX only</p>
// // // // // // // // // //         </Dragger>
// // // // // // // // // //       )}

// // // // // // // // // //       {showStartButton && (
// // // // // // // // // //         <Card title="Extracted Details" style={{ marginTop: 20 }}>
// // // // // // // // // //           <Input
// // // // // // // // // //             placeholder="Name"
// // // // // // // // // //             value={fields.name || ""}
// // // // // // // // // //             onChange={(e) => setFields({ ...fields, name: e.target.value })}
// // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // //           />
// // // // // // // // // //           <Input
// // // // // // // // // //             placeholder="Email"
// // // // // // // // // //             value={fields.email || ""}
// // // // // // // // // //             onChange={(e) => setFields({ ...fields, email: e.target.value })}
// // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // //           />
// // // // // // // // // //           <Input
// // // // // // // // // //             placeholder="Phone"
// // // // // // // // // //             value={fields.phone || ""}
// // // // // // // // // //             onChange={(e) => setFields({ ...fields, phone: e.target.value })}
// // // // // // // // // //             style={{ marginBottom: 10 }}
// // // // // // // // // //           />
// // // // // // // // // //           <Button type="primary" onClick={handleStartQuiz} disabled={loading}>
// // // // // // // // // //             {loading ? <Spin /> : "Start Test"}
// // // // // // // // // //           </Button>
// // // // // // // // // //         </Card>
// // // // // // // // // //       )}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }


// // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // import { Upload, message, Button, Card, Spin, Progress, Radio, Input } from "antd";
// // // // // // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";
// // // // // // // // // import aiService from "../services/aiService";
// // // // // // // // // import jsPDF from "jspdf";

// // // // // // // // // const { Dragger } = Upload;

// // // // // // // // // export default function Interviewee() {
// // // // // // // // //   const [fields, setFields] = useState({});
// // // // // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // //   const [questions, setQuestions] = useState([]);
// // // // // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // // // // //   const [answers, setAnswers] = useState([]);
// // // // // // // // //   const [currentAnswer, setCurrentAnswer] = useState(null);

// // // // // // // // //   const [timer, setTimer] = useState(0);
// // // // // // // // //   const [intervalId, setIntervalId] = useState(null);

// // // // // // // // //   /** ----------------- Resume Handling ----------------- **/
// // // // // // // // //   const handleFile = async (file) => {
// // // // // // // // //     if (!file) return false;
// // // // // // // // //     try {
// // // // // // // // //       const fileType = file.name.split(".").pop().toLowerCase();
// // // // // // // // //       let text = "";
// // // // // // // // //       if (fileType === "pdf") text = await extractTextFromPDF(file);
// // // // // // // // //       else if (fileType === "docx") text = await extractTextFromDocx(file);
// // // // // // // // //       else {
// // // // // // // // //         message.error("Unsupported file type");
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //       if (!text.trim()) {
// // // // // // // // //         message.error("Failed to extract text from resume");
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //       const extracted = extractFields(text);
// // // // // // // // //       setFields(extracted);
// // // // // // // // //       setShowStartButton(true);
// // // // // // // // //       message.success("Resume parsed successfully!");
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error(err);
// // // // // // // // //       message.error("Error parsing resume");
// // // // // // // // //     }
// // // // // // // // //     return false;
// // // // // // // // //   };

// // // // // // // // //   /** ----------------- Start Quiz ----------------- **/
// // // // // // // // //   const handleStartQuiz = async () => {
// // // // // // // // //     if (!fields.name || !fields.name.trim()) {
// // // // // // // // //       message.error("Name is required");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     setLoading(true);
// // // // // // // // //     try {
// // // // // // // // //       const allQuestions = await aiService.generateQuestions();
// // // // // // // // //       // Filter exactly 2 Easy, 2 Medium, 2 Hard
// // // // // // // // //       const easy = allQuestions.filter(q => q.level === "easy").slice(0,2);
// // // // // // // // //       const medium = allQuestions.filter(q => q.level === "medium").slice(0,2);
// // // // // // // // //       const hard = allQuestions.filter(q => q.level === "hard").slice(0,2);
// // // // // // // // //       const finalQuestions = [...easy, ...medium, ...hard];
// // // // // // // // //       // Add MCQ options
// // // // // // // // //       const mcqQuestions = finalQuestions.map(q => ({
// // // // // // // // //         ...q,
// // // // // // // // //         options: generateMCQOptions(q.text),
// // // // // // // // //       }));
// // // // // // // // //       setQuestions(mcqQuestions);
// // // // // // // // //       setCurrentIndex(0);
// // // // // // // // //       setAnswers([]);
// // // // // // // // //       setCurrentAnswer(null);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error(err);
// // // // // // // // //       message.error("Failed to generate questions");
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   /** ----------------- Timer per Question ----------------- **/
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (!questions.length) return;
// // // // // // // // //     const q = questions[currentIndex];
// // // // // // // // //     let timeLimit = 30; // default
// // // // // // // // //     if (q.level === "easy") timeLimit = 20;
// // // // // // // // //     if (q.level === "medium") timeLimit = 60;
// // // // // // // // //     if (q.level === "hard") timeLimit = 120;
// // // // // // // // //     setTimer(timeLimit);

// // // // // // // // //     if (intervalId) clearInterval(intervalId);
// // // // // // // // //     const id = setInterval(() => {
// // // // // // // // //       setTimer(t => {
// // // // // // // // //         if (t <= 1) {
// // // // // // // // //           clearInterval(id);
// // // // // // // // //           handleNext(); // auto-submit when time runs out
// // // // // // // // //           return 0;
// // // // // // // // //         }
// // // // // // // // //         return t - 1;
// // // // // // // // //       });
// // // // // // // // //     }, 1000);
// // // // // // // // //     setIntervalId(id);
// // // // // // // // //     return () => clearInterval(id);
// // // // // // // // //     // eslint-disable-next-line
// // // // // // // // //   }, [currentIndex, questions]);

// // // // // // // // //   /** ----------------- Next Question ----------------- **/
// // // // // // // // //   const handleNext = async () => {
// // // // // // // // //     const q = questions[currentIndex];
// // // // // // // // //     const score = await aiService.scoreAnswer(q, currentAnswer || "");
// // // // // // // // //     const updatedAnswers = [...answers, { question: q, answer: currentAnswer || "No answer", score }];
// // // // // // // // //     setAnswers(updatedAnswers);
// // // // // // // // //     setCurrentAnswer(null);

// // // // // // // // //     if (currentIndex + 1 < questions.length) {
// // // // // // // // //       setCurrentIndex(currentIndex + 1);
// // // // // // // // //     } else {
// // // // // // // // //       // Quiz complete → generate summary & scorecard
// // // // // // // // //       clearInterval(intervalId);
// // // // // // // // //       const summary = await aiService.summarizeCandidate({
// // // // // // // // //         profile: fields,
// // // // // // // // //         session: { answers: updatedAnswers }
// // // // // // // // //       });
// // // // // // // // //       message.success(summary, 15);
// // // // // // // // //       generateScorecard(updatedAnswers, fields.name);
// // // // // // // // //       // Reset to uploader for next candidate
// // // // // // // // //       setQuestions([]);
// // // // // // // // //       setShowStartButton(false);
// // // // // // // // //       setFields({});
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   /** ----------------- MCQ Options ----------------- **/
// // // // // // // // //   const generateMCQOptions = (questionText) => {
// // // // // // // // //     const fillers = [
// // // // // // // // //       "Option A", "Option B", "Option C", "Option D",
// // // // // // // // //       "Not Sure", "Cannot Answer", "Depends", "I don't know"
// // // // // // // // //     ];
// // // // // // // // //     const options = [questionText]; // correct answer = first
// // // // // // // // //     while (options.length < 4) {
// // // // // // // // //       const choice = fillers[Math.floor(Math.random() * fillers.length)];
// // // // // // // // //       if (!options.includes(choice)) options.push(choice);
// // // // // // // // //     }
// // // // // // // // //     return shuffleArray(options);
// // // // // // // // //   };
// // // // // // // // //   const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

// // // // // // // // //   /** ----------------- Generate PDF Scorecard ----------------- **/
// // // // // // // // //   const generateScorecard = (answers, candidateName) => {
// // // // // // // // //     const doc = new jsPDF();
// // // // // // // // //     doc.setFontSize(16);
// // // // // // // // //     doc.text(`Scorecard for ${candidateName}`, 20, 20);
// // // // // // // // //     doc.setFontSize(12);
// // // // // // // // //     answers.forEach((a, i) => {
// // // // // // // // //       doc.text(
// // // // // // // // //         `${i+1}. ${a.question.text} - Answer: ${a.answer} - Score: ${a.score}`,
// // // // // // // // //         20, 30 + i*10
// // // // // // // // //       );
// // // // // // // // //     });
// // // // // // // // //     const total = answers.reduce((s,a)=>s+(a.score||0),0);
// // // // // // // // //     doc.text(`Total Score: ${total}`, 20, 40 + answers.length*10);
// // // // // // // // //     doc.save(`${candidateName}_Scorecard.pdf`);
// // // // // // // // //   };

// // // // // // // // //   /** ----------------- Render ----------------- **/
// // // // // // // // //   if (questions.length) {
// // // // // // // // //     const q = questions[currentIndex];
// // // // // // // // //     return (
// // // // // // // // //       <Card title={`Question ${currentIndex+1} / ${questions.length}`}>
// // // // // // // // //         <p>{q.text} (Level: {q.level})</p>
// // // // // // // // //         <Radio.Group
// // // // // // // // //           value={currentAnswer}
// // // // // // // // //           onChange={e => setCurrentAnswer(e.target.value)}
// // // // // // // // //           style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
// // // // // // // // //         >
// // // // // // // // //           {q.options.map((opt,i)=>(
// // // // // // // // //             <Radio key={i} value={opt} style={{ marginBottom: 5 }}>{opt}</Radio>
// // // // // // // // //           ))}
// // // // // // // // //         </Radio.Group>
// // // // // // // // //         <Progress percent={Math.round((currentIndex/questions.length)*100)} style={{ marginBottom: 10 }} />
// // // // // // // // //         <p>Time Remaining: {timer}s</p>
// // // // // // // // //         <Button type="primary" onClick={handleNext}>Submit & Next</Button>
// // // // // // // // //       </Card>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <div style={{ maxWidth: 600, margin: "0 auto" }}>
// // // // // // // // //       {!showStartButton && (
// // // // // // // // //         <Dragger
// // // // // // // // //           accept=".pdf,.docx"
// // // // // // // // //           beforeUpload={handleFile}
// // // // // // // // //           multiple={false}
// // // // // // // // //           showUploadList={false}
// // // // // // // // //           style={{ padding: 20 }}
// // // // // // // // //         >
// // // // // // // // //           <p className="ant-upload-drag-icon"><InboxOutlined /></p>
// // // // // // // // //           <p className="ant-upload-text">Click or drag resume here</p>
// // // // // // // // //           <p className="ant-upload-hint">Supports PDF or DOCX only</p>
// // // // // // // // //         </Dragger>
// // // // // // // // //       )}
// // // // // // // // //       {showStartButton && (
// // // // // // // // //         <Card title="Extracted Details" style={{ marginTop: 20 }}>
// // // // // // // // //           <Input
// // // // // // // // //             placeholder="Name"
// // // // // // // // //             value={fields.name||""}
// // // // // // // // //             onChange={e => setFields({...fields,name:e.target.value})}
// // // // // // // // //             style={{ marginBottom:10 }}
// // // // // // // // //           />
// // // // // // // // //           <Input
// // // // // // // // //             placeholder="Email"
// // // // // // // // //             value={fields.email||""}
// // // // // // // // //             onChange={e => setFields({...fields,email:e.target.value})}
// // // // // // // // //             style={{ marginBottom:10 }}
// // // // // // // // //           />
// // // // // // // // //           <Input
// // // // // // // // //             placeholder="Phone"
// // // // // // // // //             value={fields.phone||""}
// // // // // // // // //             onChange={e => setFields({...fields,phone:e.target.value})}
// // // // // // // // //             style={{ marginBottom:10 }}
// // // // // // // // //           />
// // // // // // // // //           <Button type="primary" onClick={handleStartQuiz} disabled={loading}>
// // // // // // // // //             {loading ? <Spin /> : "Start Test"}
// // // // // // // // //           </Button>
// // // // // // // // //         </Card>
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }


// // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // import { Upload, message, Button, Card, Radio, Input, Progress, Typography } from "antd";
// // // // // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // // // // import jsPDF from "jspdf";

// // // // // // // // const { Dragger } = Upload;
// // // // // // // // const { Title, Paragraph } = Typography;

// // // // // // // // // Predefined MCQs for Fullstack role
// // // // // // // // const QUESTIONS = [
// // // // // // // //   // Easy
// // // // // // // //   {
// // // // // // // //     text: "Which of the following is a correct way to create a React functional component?",
// // // // // // // //     level: "easy",
// // // // // // // //     options: [
// // // // // // // //       "function MyComponent() { return <h1>Hello</h1>; }",
// // // // // // // //       "component MyComponent() { return 'Hello'; }",
// // // // // // // //       "new ReactComponent() { return <div>Hello</div>; }",
// // // // // // // //       "class MyComponent extends Function {}"
// // // // // // // //     ],
// // // // // // // //     correctAnswer: "function MyComponent() { return <h1>Hello</h1>; }",
// // // // // // // //     timeLimit: 20
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     text: "Which HTML tag is used to link an external CSS file?",
// // // // // // // //     level: "easy",
// // // // // // // //     options: ["<script>", "<link>", "<style>", "<css>"],
// // // // // // // //     correctAnswer: "<link>",
// // // // // // // //     timeLimit: 20
// // // // // // // //   },
// // // // // // // //   // Medium
// // // // // // // //   {
// // // // // // // //     text: "In MongoDB, which query finds all users whose age is greater than 25?",
// // // // // // // //     level: "medium",
// // // // // // // //     options: [
// // // // // // // //       "db.users.find({age: 25})",
// // // // // // // //       "db.users.find({age: {$gt: 25}})",
// // // // // // // //       "db.users.find({age > 25})",
// // // // // // // //       "db.users.get({age: >25})"
// // // // // // // //     ],
// // // // // // // //     correctAnswer: "db.users.find({age: {$gt: 25}})",
// // // // // // // //     timeLimit: 60
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     text: "Which of the following is true about CSS Flexbox?",
// // // // // // // //     level: "medium",
// // // // // // // //     options: [
// // // // // // // //       "justify-content aligns items along the cross axis",
// // // // // // // //       "align-items aligns items along the main axis",
// // // // // // // //       "flex-direction can be row or column",
// // // // // // // //       "Flexbox is only for horizontal alignment"
// // // // // // // //     ],
// // // // // // // //     correctAnswer: "flex-direction can be row or column",
// // // // // // // //     timeLimit: 60
// // // // // // // //   },
// // // // // // // //   // Hard
// // // // // // // //   {
// // // // // // // //     text: `Node.js/Express: What will be the output of this code when accessing /hello?\n
// // // // // // // // const express = require('express');
// // // // // // // // const app = express();
// // // // // // // // app.get('/hello', (req, res) => { res.send('Hello World'); });
// // // // // // // // app.listen(3000, () => console.log('Server running on port 3000'));`,
// // // // // // // //     level: "hard",
// // // // // // // //     options: ["Server crashes", '"Hello World"', '"undefined"', "404 Error"],
// // // // // // // //     correctAnswer: '"Hello World"',
// // // // // // // //     timeLimit: 120
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     text: `React/JSX: What will be rendered on the browser?\n
// // // // // // // // import React, { useState } from 'react';
// // // // // // // // function Counter() {
// // // // // // // //   const [count, setCount] = useState(0);
// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <p>{count}</p>
// // // // // // // //       <button onClick={() => setCount(count + 1)}>Increment</button>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // // export default Counter;`,
// // // // // // // //     level: "hard",
// // // // // // // //     options: [
// // // // // // // //       "Always shows 0",
// // // // // // // //       "Shows 0 initially, increases by 1 on each button click",
// // // // // // // //       'Shows "count" text',
// // // // // // // //       "Button will not work"
// // // // // // // //     ],
// // // // // // // //     correctAnswer: "Shows 0 initially, increases by 1 on each button click",
// // // // // // // //     timeLimit: 120
// // // // // // // //   }
// // // // // // // // ];

// // // // // // // // export default function Interviewee() {
// // // // // // // //   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
// // // // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // // // //   const [quizStarted, setQuizStarted] = useState(false);
// // // // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // // // //   const [answers, setAnswers] = useState([]);
// // // // // // // //   const [currentAnswer, setCurrentAnswer] = useState(null);
// // // // // // // //   const [timer, setTimer] = useState(0);
// // // // // // // //   const [intervalId, setIntervalId] = useState(null);
// // // // // // // //   const [showScorecard, setShowScorecard] = useState(false);

// // // // // // // //   /** ----------------- Resume Handling ----------------- **/
// // // // // // // //   const handleFile = async (file) => {
// // // // // // // //     if (!file) return false;
// // // // // // // //     setShowStartButton(true);
// // // // // // // //     message.success("Resume uploaded (mock, real extraction optional)");
// // // // // // // //     return false; // prevent upload
// // // // // // // //   };

// // // // // // // //   const handleFieldChange = (key, value) =>
// // // // // // // //     setFields((prev) => ({ ...prev, [key]: value }));

// // // // // // // //   /** ----------------- Start Quiz ----------------- **/
// // // // // // // //   const handleStartQuiz = () => {
// // // // // // // //     if (!fields.name.trim()) {
// // // // // // // //       message.error("Name is required");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     setQuizStarted(true);
// // // // // // // //     setCurrentIndex(0);
// // // // // // // //     setAnswers([]);
// // // // // // // //     setCurrentAnswer(null);
// // // // // // // //   };

// // // // // // // //   /** ----------------- Timer Effect ----------------- **/
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!quizStarted) return;
// // // // // // // //     const q = QUESTIONS[currentIndex];
// // // // // // // //     setTimer(q.timeLimit);

// // // // // // // //     if (intervalId) clearInterval(intervalId);
// // // // // // // //     const id = setInterval(() => {
// // // // // // // //       setTimer((t) => {
// // // // // // // //         if (t <= 1) {
// // // // // // // //           clearInterval(id);
// // // // // // // //           handleNext();
// // // // // // // //           return 0;
// // // // // // // //         }
// // // // // // // //         return t - 1;
// // // // // // // //       });
// // // // // // // //     }, 1000);
// // // // // // // //     setIntervalId(id);
// // // // // // // //     return () => clearInterval(id);
// // // // // // // //     // eslint-disable-next-line
// // // // // // // //   }, [currentIndex, quizStarted]);

// // // // // // // //   /** ----------------- Next Question ----------------- **/
// // // // // // // //   const handleNext = () => {
// // // // // // // //     const q = QUESTIONS[currentIndex];
// // // // // // // //     const score = currentAnswer === q.correctAnswer ? 10 : 0;
// // // // // // // //     setAnswers([...answers, { question: q, answer: currentAnswer || "No answer", score }]);
// // // // // // // //     setCurrentAnswer(null);

// // // // // // // //     if (currentIndex + 1 < QUESTIONS.length) {
// // // // // // // //       setCurrentIndex(currentIndex + 1);
// // // // // // // //     } else {
// // // // // // // //       clearInterval(intervalId);
// // // // // // // //       setShowScorecard(true);
// // // // // // // //       setQuizStarted(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   /** ----------------- Generate PDF Scorecard (Optional) ----------------- **/
// // // // // // // //   const generatePDF = () => {
// // // // // // // //     const doc = new jsPDF();
// // // // // // // //     doc.setFontSize(16);
// // // // // // // //     doc.text(`Scorecard: ${fields.name}`, 20, 20);
// // // // // // // //     doc.setFontSize(12);
// // // // // // // //     answers.forEach((a, i) => {
// // // // // // // //       doc.text(
// // // // // // // //         `${i + 1}. ${a.question.text}\nYour Answer: ${a.answer}\nCorrect Answer: ${a.question.correctAnswer}\nScore: ${a.score}`,
// // // // // // // //         20,
// // // // // // // //         30 + i * 20
// // // // // // // //       );
// // // // // // // //     });
// // // // // // // //     const total = answers.reduce((s, a) => s + a.score, 0);
// // // // // // // //     doc.text(`Total Score: ${total}`, 20, 40 + answers.length * 20);
// // // // // // // //     doc.save(`${fields.name}_Scorecard.pdf`);
// // // // // // // //   };

// // // // // // // //   /** ----------------- Render ----------------- **/
// // // // // // // //   if (quizStarted) {
// // // // // // // //     const q = QUESTIONS[currentIndex];
// // // // // // // //     return (
// // // // // // // //       <Card title={`Question ${currentIndex + 1} / ${QUESTIONS.length}`}>
// // // // // // // //         <pre>{q.text}</pre>
// // // // // // // //         <Radio.Group
// // // // // // // //           value={currentAnswer}
// // // // // // // //           onChange={(e) => setCurrentAnswer(e.target.value)}
// // // // // // // //           style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
// // // // // // // //         >
// // // // // // // //           {q.options.map((opt, i) => (
// // // // // // // //             <Radio key={i} value={opt} style={{ marginBottom: 5 }}>
// // // // // // // //               {opt}
// // // // // // // //             </Radio>
// // // // // // // //           ))}
// // // // // // // //         </Radio.Group>
// // // // // // // //         <Progress
// // // // // // // //           percent={Math.round((currentIndex / QUESTIONS.length) * 100)}
// // // // // // // //           style={{ marginBottom: 10 }}
// // // // // // // //         />
// // // // // // // //         <p>Time Remaining: {timer}s</p>
// // // // // // // //         <Button type="primary" onClick={handleNext}>
// // // // // // // //           Submit & Next
// // // // // // // //         </Button>
// // // // // // // //       </Card>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (showScorecard) {
// // // // // // // //     const total = answers.length;
// // // // // // // //     const correct = answers.filter((a) => a.score === 10).length;
// // // // // // // //     const wrong = total - correct;
// // // // // // // //     return (
// // // // // // // //       <Card title={`Scorecard: ${fields.name}`} style={{ maxWidth: 800, margin: "20px auto" }}>
// // // // // // // //         <Title level={4}>Summary</Title>
// // // // // // // //         <p>Total Questions: {total}</p>
// // // // // // // //         <p>Correct Answers: {correct}</p>
// // // // // // // //         <p>Wrong Answers: {wrong}</p>
// // // // // // // //         <Button onClick={generatePDF} type="primary" style={{ marginTop: 10 }}>
// // // // // // // //           Download PDF
// // // // // // // //         </Button>
// // // // // // // //         <Card type="inner" style={{ marginTop: 20, background: "#f6f8fa" }}>
// // // // // // // //           <Paragraph>
// // // // // // // //             Great job, {fields.name}! Remember, keep building, learning, and growing as a Fullstack Developer at SWIPE, Hyderabad! 💪
// // // // // // // //           </Paragraph>
// // // // // // // //         </Card>
// // // // // // // //         <Card type="inner" style={{ marginTop: 20 }}>
// // // // // // // //           {answers.map((a, i) => (
// // // // // // // //             <div key={i} style={{ marginBottom: 10 }}>
// // // // // // // //               <b>Q{i + 1}:</b> {a.question.text}
// // // // // // // //               <br />
// // // // // // // //               <b>Your Answer:</b> {a.answer}
// // // // // // // //               <br />
// // // // // // // //               <b>Correct Answer:</b> {a.question.correctAnswer}
// // // // // // // //               <br />
// // // // // // // //               <b>Score:</b> {a.score}
// // // // // // // //             </div>
// // // // // // // //           ))}
// // // // // // // //         </Card>
// // // // // // // //       </Card>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   // Intro / Resume Upload page
// // // // // // // //   return (
// // // // // // // //     <div style={{ maxWidth: 800, margin: "0 auto" }}>
// // // // // // // //       <Card title="Welcome to the Fullstack Developer Quiz">
// // // // // // // //         <Paragraph>
// // // // // // // //           Role: Fullstack Developer (React/Node)
// // // // // // // //           <br />
// // // // // // // //           Company: SWIPE, Hyderabad
// // // // // // // //           <br />
// // // // // // // //           This quiz will test your Fullstack knowledge with 6 MCQs: 2 Easy, 2 Medium, 2 Hard.
// // // // // // // //           <br />
// // // // // // // //           Timers: Easy - 20s, Medium - 60s, Hard - 120s per question.
// // // // // // // //         </Paragraph>

// // // // // // // //         {!showStartButton && (
// // // // // // // //           <Dragger
// // // // // // // //             accept=".pdf,.docx"
// // // // // // // //             beforeUpload={handleFile}
// // // // // // // //             multiple={false}
// // // // // // // //             showUploadList={false}
// // // // // // // //             style={{ padding: 20 }}
// // // // // // // //           >
// // // // // // // //             <p className="ant-upload-drag-icon">
// // // // // // // //               <InboxOutlined />
// // // // // // // //             </p>
// // // // // // // //             <p className="ant-upload-text">Click or drag resume here</p>
// // // // // // // //             <p className="ant-upload-hint">Supports PDF or DOCX only</p>
// // // // // // // //           </Dragger>
// // // // // // // //         )}

// // // // // // // //         {showStartButton && (
// // // // // // // //           <Card title="Enter Your Details" style={{ marginTop: 20 }}>
// // // // // // // //             <Input
// // // // // // // //               placeholder="Name"
// // // // // // // //               value={fields.name}
// // // // // // // //               onChange={(e) => handleFieldChange("name", e.target.value)}
// // // // // // // //               style={{ marginBottom: 10 }}
// // // // // // // //             />
// // // // // // // //             <Input
// // // // // // // //               placeholder="Email"
// // // // // // // //               value={fields.email}
// // // // // // // //               onChange={(e) => handleFieldChange("email", e.target.value)}
// // // // // // // //               style={{ marginBottom: 10 }}
// // // // // // // //             />
// // // // // // // //             <Input
// // // // // // // //               placeholder="Phone"
// // // // // // // //               value={fields.phone}
// // // // // // // //               onChange={(e) => handleFieldChange("phone", e.target.value)}
// // // // // // // //               style={{ marginBottom: 10 }}
// // // // // // // //             />
// // // // // // // //             <Button type="primary" onClick={handleStartQuiz}>
// // // // // // // //               Start Quiz
// // // // // // // //             </Button>
// // // // // // // //           </Card>
// // // // // // // //         )}
// // // // // // // //       </Card>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }


// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import { Upload, Button, Card, Input, Typography, message, Radio } from "antd";
// // // // // // // import { InboxOutlined, LaptopOutlined, NodeIndexOutlined, CodeOutlined } from "@ant-design/icons";
// // // // // // // import * as pdfjsLib from "pdfjs-dist/build/pdf";
// // // // // // // import mammoth from "mammoth";
// // // // // // // import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
// // // // // // // import jsPDF from "jspdf";

// // // // // // // const { Dragger } = Upload;
// // // // // // // const { Title, Paragraph } = Typography;

// // // // // // // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// // // // // // // // MCQs
// // // // // // // const questions = [
// // // // // // //   // Easy
// // // // // // //   {
// // // // // // //     id: 1,
// // // // // // //     level: "Easy",
// // // // // // //     text: "Which of the following is a correct way to create a React functional component?",
// // // // // // //     options: [
// // // // // // //       "function MyComponent() { return <h1>Hello</h1>; }",
// // // // // // //       "component MyComponent() { return 'Hello'; }",
// // // // // // //       "new ReactComponent() { return <div>Hello</div>; }",
// // // // // // //       "class MyComponent extends Function {}"
// // // // // // //     ],
// // // // // // //     answer: 0,
// // // // // // //     time: 20
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 2,
// // // // // // //     level: "Easy",
// // // // // // //     text: "Which HTML tag is used to link an external CSS file?",
// // // // // // //     options: ["<script>", "<link>", "<style>", "<css>"],
// // // // // // //     answer: 1,
// // // // // // //     time: 20
// // // // // // //   },
// // // // // // //   // Medium
// // // // // // //   {
// // // // // // //     id: 3,
// // // // // // //     level: "Medium",
// // // // // // //     text: "In MongoDB, which query finds all users whose age is greater than 25?",
// // // // // // //     options: [
// // // // // // //       "db.users.find({age: 25})",
// // // // // // //       "db.users.find({age: {$gt: 25}})",
// // // // // // //       "db.users.find({age > 25})",
// // // // // // //       "db.users.get({age: >25})"
// // // // // // //     ],
// // // // // // //     answer: 1,
// // // // // // //     time: 60
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 4,
// // // // // // //     level: "Medium",
// // // // // // //     text: "Which of the following is true about CSS Flexbox?",
// // // // // // //     options: [
// // // // // // //       "justify-content aligns items along the cross axis",
// // // // // // //       "align-items aligns items along the main axis",
// // // // // // //       "flex-direction can be row or column",
// // // // // // //       "Flexbox is only for horizontal alignment"
// // // // // // //     ],
// // // // // // //     answer: 2,
// // // // // // //     time: 60
// // // // // // //   },
// // // // // // //   // Hard
// // // // // // //   {
// // // // // // //     id: 5,
// // // // // // //     level: "Hard",
// // // // // // //     text: `Node.js/Express: What will be the output of this code when accessing /hello?
// // // // // // // const express = require('express');
// // // // // // // const app = express();
// // // // // // // app.get('/hello', (req, res) => { res.send('Hello World'); });
// // // // // // // app.listen(3000, () => console.log('Server running on port 3000'));`,
// // // // // // //     options: ["Server crashes", '"Hello World"', '"undefined"', "404 Error"],
// // // // // // //     answer: 1,
// // // // // // //     time: 120
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 6,
// // // // // // //     level: "Hard",
// // // // // // //     text: `React/JSX: What will be rendered on the browser?
// // // // // // // import React, { useState } from 'react';
// // // // // // // function Counter() {
// // // // // // //   const [count, setCount] = useState(0);
// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <p>{count}</p>
// // // // // // //       <button onClick={() => setCount(count + 1)}>Increment</button>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }
// // // // // // // export default Counter;`,
// // // // // // //     options: [
// // // // // // //       "Always shows 0",
// // // // // // //       "Shows 0 initially, increases by 1 on each button click",
// // // // // // //       'Shows "count" text',
// // // // // // //       "Button will not work"
// // // // // // //     ],
// // // // // // //     answer: 1,
// // // // // // //     time: 120
// // // // // // //   }
// // // // // // // ];

// // // // // // // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// // // // // // // export default function Interviewee() {
// // // // // // //   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
// // // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // // //   const [quizStarted, setQuizStarted] = useState(false);
// // // // // // //   const [currentQ, setCurrentQ] = useState(0);
// // // // // // //   const [answers, setAnswers] = useState([]);
// // // // // // //   const [timeLeft, setTimeLeft] = useState(0);
// // // // // // //   const [showSummary, setShowSummary] = useState(false);

// // // // // // //   /** ----------------- File Handling ----------------- **/
// // // // // // //   const handleFieldChange = (key, value) =>
// // // // // // //     setFields((prev) => ({ ...prev, [key]: value }));

// // // // // // //   const extractFieldsFromText = (text) => {
// // // // // // //     const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/);
// // // // // // //     const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}/);
// // // // // // //     const lines = text.split("\n").map(l => l.trim()).filter(l => l);
// // // // // // //     const nameMatch = lines.length > 0 ? lines[0] : "";
// // // // // // //     return {
// // // // // // //       name: nameMatch,
// // // // // // //       email: emailMatch ? emailMatch[0] : "",
// // // // // // //       phone: phoneMatch ? phoneMatch[0] : ""
// // // // // // //     };
// // // // // // //   };

// // // // // // //   const handleFile = async (file) => {
// // // // // // //     if (!file) return false;
// // // // // // //     const ext = file.name.split(".").pop().toLowerCase();
// // // // // // //     let text = "";
// // // // // // //     try {
// // // // // // //       if (ext === "pdf") {
// // // // // // //         const arrayBuffer = await file.arrayBuffer();
// // // // // // //         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// // // // // // //         let content = "";
// // // // // // //         for (let i = 1; i <= pdf.numPages; i++) {
// // // // // // //           const page = await pdf.getPage(i);
// // // // // // //           const txt = await page.getTextContent();
// // // // // // //           content += txt.items.map(i => i.str).join(" ") + "\n";
// // // // // // //         }
// // // // // // //         text = content;
// // // // // // //       } else if (ext === "docx") {
// // // // // // //         const arrayBuffer = await file.arrayBuffer();
// // // // // // //         const result = await mammoth.extractRawText({ arrayBuffer });
// // // // // // //         text = result.value;
// // // // // // //       } else {
// // // // // // //         message.error("Unsupported file type.");
// // // // // // //         return false;
// // // // // // //       }
// // // // // // //       const extracted = extractFieldsFromText(text);
// // // // // // //       setFields(extracted);
// // // // // // //       setShowStartButton(true);
// // // // // // //       message.success("Resume parsed successfully!");
// // // // // // //     } catch (err) {
// // // // // // //       console.error(err);
// // // // // // //       message.error("Failed to parse resume.");
// // // // // // //     }
// // // // // // //     return false;
// // // // // // //   };

// // // // // // //   /** ----------------- Quiz Handling ----------------- **/
// // // // // // //   const startQuiz = () => {
// // // // // // //     if (!fields.name.trim()) {
// // // // // // //       message.error("Name is required!");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     setQuizStarted(true);
// // // // // // //     setCurrentQ(0);
// // // // // // //     setAnswers([]);
// // // // // // //     setTimeLeft(questions[0].time);
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     if (!quizStarted || showSummary) return;
// // // // // // //     if (timeLeft <= 0) {
// // // // // // //       handleNext(null); // auto submit blank
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
// // // // // // //     return () => clearInterval(timer);
// // // // // // //   }, [timeLeft, quizStarted, showSummary]);

// // // // // // //   const handleNext = (selectedIndex) => {
// // // // // // //     const q = questions[currentQ];
// // // // // // //     setAnswers(prev => [...prev, { ...q, selected: selectedIndex }]);
// // // // // // //     const nextQ = currentQ + 1;
// // // // // // //     if (nextQ < questions.length) {
// // // // // // //       setCurrentQ(nextQ);
// // // // // // //       setTimeLeft(questions[nextQ].time);
// // // // // // //     } else {
// // // // // // //       setQuizStarted(false);
// // // // // // //       setShowSummary(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   /** ----------------- Generate PDF ----------------- **/
// // // // // // //   const downloadSummary = () => {
// // // // // // //     const doc = new jsPDF();
// // // // // // //     doc.setFontSize(16);
// // // // // // //     doc.text(`Quiz Summary - ${fields.name}`, 10, 20);
// // // // // // //     let y = 30;
// // // // // // //     answers.forEach((a, i) => {
// // // // // // //       doc.setFontSize(12);
// // // // // // //       doc.text(
// // // // // // //         `${i + 1}. ${a.text}`,
// // // // // // //         10, y
// // // // // // //       );
// // // // // // //       y += 6;
// // // // // // //       a.options.forEach((opt, idx) => {
// // // // // // //         const prefix = idx === a.answer ? "(Correct) " : "";
// // // // // // //         const sel = idx === a.selected ? "(Your answer) " : "";
// // // // // // //         doc.text(`   ${prefix}${sel}${opt}`, 10, y);
// // // // // // //         y += 6;
// // // // // // //       });
// // // // // // //       y += 4;
// // // // // // //     });
// // // // // // //     const score = answers.reduce((s,a)=>s + (a.selected === a.answer ? 1 : 0),0);
// // // // // // //     doc.text(`Total Score: ${score} / ${questions.length}`, 10, y+10);
// // // // // // //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// // // // // // //   };

// // // // // // //   /** ----------------- Render ----------------- **/
// // // // // // //   if (!quizStarted && !showSummary) {
// // // // // // //     return (
// // // // // // //       <div
// // // // // // //         style={{
// // // // // // //           minHeight: "100vh",
// // // // // // //           display: "flex",
// // // // // // //           justifyContent: "center",
// // // // // // //           alignItems: "center",
// // // // // // //           background: "linear-gradient(to right, #667eea, #764ba2)",
// // // // // // //           padding: 20,
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         <Card style={{ maxWidth: 800, width: "100%", borderRadius: 15, boxShadow: "0 8px 20px rgba(0,0,0,0.2)", padding: 30, backgroundColor: "white" }}>
// // // // // // //           <div style={{ textAlign: "center", marginBottom: 20 }}>
// // // // // // //             <Title level={2}>Welcome to the Fullstack Developer Quiz!</Title>
// // // // // // //             <Paragraph>Sharpen your React & Node skills for SWIPE, Hyderabad.</Paragraph>
// // // // // // //           </div>
// // // // // // //           <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 30 }}>
// // // // // // //             <Card style={{ textAlign: "center", width: "30%" }}><LaptopOutlined style={{ fontSize: 30, color: "#667eea" }} /><Paragraph>Fullstack Role</Paragraph></Card>
// // // // // // //             <Card style={{ textAlign: "center", width: "30%" }}><NodeIndexOutlined style={{ fontSize: 30, color: "#764ba2" }} /><Paragraph>SWIPE, Hyderabad</Paragraph></Card>
// // // // // // //             <Card style={{ textAlign: "center", width: "30%" }}><CodeOutlined style={{ fontSize: 30, color: "#00b894" }} /><Paragraph>6 MCQs</Paragraph></Card>
// // // // // // //           </div>
// // // // // // //           {!showStartButton && (
// // // // // // //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false}
// // // // // // //               style={{ padding: 30, borderRadius: 10, border: "2px dashed #667eea", backgroundColor: "#f7f7f7", marginBottom: 20 }}>
// // // // // // //               <p className="ant-upload-drag-icon"><InboxOutlined style={{ fontSize: 32, color: "#667eea" }} /></p>
// // // // // // //               <p className="ant-upload-text">Click or drag resume here</p>
// // // // // // //               <p className="ant-upload-hint">PDF or DOCX only.</p>
// // // // // // //             </Dragger>
// // // // // // //           )}
// // // // // // //           {showStartButton && (
// // // // // // //             <Card style={{ borderRadius: 10, padding: 20 }}>
// // // // // // //               <Input placeholder="Name" value={fields.name} onChange={(e)=>handleFieldChange("name", e.target.value)} style={{ marginBottom: 10 }} />
// // // // // // //               <Input placeholder="Email" value={fields.email} onChange={(e)=>handleFieldChange("email", e.target.value)} style={{ marginBottom: 10 }} />
// // // // // // //               <Input placeholder="Phone" value={fields.phone} onChange={(e)=>handleFieldChange("phone", e.target.value)} style={{ marginBottom: 20 }} />
// // // // // // //               <Button type="primary" size="large" block onClick={startQuiz} style={{ background: "linear-gradient(to right, #667eea, #764ba2)", border: "none" }}>Start Quiz</Button>
// // // // // // //             </Card>
// // // // // // //           )}
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     )
// // // // // // //   }

// // // // // // //   if (quizStarted) {
// // // // // // //     const q = questions[currentQ];
// // // // // // //     return (
// // // // // // //       <div style={{ padding: 20 }}>
// // // // // // //         <Card title={`Question ${currentQ + 1} (${q.level}) - Time Left: ${timeLeft}s`}>
// // // // // // //           <Paragraph>{q.text}</Paragraph>
// // // // // // //           <Radio.Group onChange={e => handleNext(e.target.value)} value={null} style={{ display:"flex", flexDirection:"column" }}>
// // // // // // //             {q.options.map((opt,i) => <Radio.Button key={i} value={i} style={{ marginBottom: 10 }}>{opt}</Radio.Button>)}
// // // // // // //           </Radio.Group>
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     )
// // // // // // //   }

// // // // // // //   if (showSummary) {
// // // // // // //     const score = answers.reduce((s,a)=>s + (a.selected === a.answer ? 1 : 0),0);
// // // // // // //     const pieData = answers.map((a,i)=>({
// // // // // // //       name: `Q${i+1}`,
// // // // // // //       Correct: a.selected === a.answer ? 1 : 0,
// // // // // // //       Incorrect: a.selected !== a.answer ? 1 : 0
// // // // // // //     }));
// // // // // // //     return (
// // // // // // //       <div style={{ padding: 20 }}>
// // // // // // //         <Card title={`Summary for ${fields.name}`}>
// // // // // // //           <Paragraph>Total Score: {score} / {questions.length}</Paragraph>
// // // // // // //           <PieChart width={400} height={250}>
// // // // // // //             <Pie dataKey="Correct" data={pieData} cx={200} cy={125} outerRadius={80} label>
// // // // // // //               {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
// // // // // // //             </Pie>
// // // // // // //             <Tooltip />
// // // // // // //             <Legend />
// // // // // // //           </PieChart>
// // // // // // //           <Button type="primary" onClick={downloadSummary} style={{ marginTop: 20 }}>Download Summary PDF</Button>
// // // // // // //           <Card style={{ marginTop: 20, backgroundColor: "#f0f0f0" }}>
// // // // // // //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// // // // // // //           </Card>
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     )
// // // // // // //   }

// // // // // // //   return null;
// // // // // // // }


// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
// // // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // // import * as pdfjsLib from "pdfjs-dist/build/pdf";
// // // // // // import mammoth from "mammoth";
// // // // // // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // // // // // import jsPDF from "jspdf";

// // // // // // const { Dragger } = Upload;
// // // // // // const { Title, Paragraph } = Typography;

// // // // // // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// // // // // // const COLORS = ["#00C49F", "#FF8042"];

// // // // // // const questions = [
// // // // // //   {
// // // // // //     id: 1,
// // // // // //     level: "Easy",
// // // // // //     text: "Which of the following is a correct way to create a React functional component?",
// // // // // //     options: [
// // // // // //       "function MyComponent() { return <h1>Hello</h1>; }",
// // // // // //       "component MyComponent() { return 'Hello'; }",
// // // // // //       "new ReactComponent() { return <div>Hello</div>; }",
// // // // // //       "class MyComponent extends Function {}"
// // // // // //     ],
// // // // // //     answer: 0,
// // // // // //     time: 20
// // // // // //   },
// // // // // //   // ... all 6 questions as before
// // // // // //   {
// // // // // //     id: 6,
// // // // // //     level: "Hard",
// // // // // //     text: `React/JSX: What will be rendered on the browser?
// // // // // // import React, { useState } from 'react';
// // // // // // function Counter() {
// // // // // //   const [count, setCount] = useState(0);
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <p>{count}</p>
// // // // // //       <button onClick={() => setCount(count + 1)}>Increment</button>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // // export default Counter;`,
// // // // // //     options: [
// // // // // //       "Always shows 0",
// // // // // //       "Shows 0 initially, increases by 1 on each button click",
// // // // // //       'Shows "count" text',
// // // // // //       "Button will not work"
// // // // // //     ],
// // // // // //     answer: 1,
// // // // // //     time: 120
// // // // // //   }
// // // // // // ];

// // // // // // export default function Interviewee() {
// // // // // //   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
// // // // // //   const [showStartButton, setShowStartButton] = useState(false);
// // // // // //   const [quizStarted, setQuizStarted] = useState(false);
// // // // // //   const [currentQ, setCurrentQ] = useState(0);
// // // // // //   const [answers, setAnswers] = useState([]);
// // // // // //   const [timeLeft, setTimeLeft] = useState(0);
// // // // // //   const [showSummary, setShowSummary] = useState(false);

// // // // // //   const handleFieldChange = (key, value) =>
// // // // // //     setFields(prev => ({ ...prev, [key]: value }));

// // // // // //   /** ----------------- Extract from Text ----------------- **/
// // // // // //   const extractFieldsFromText = text => {
// // // // // //     const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/);
// // // // // //     const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}/);
// // // // // //     const lines = text.split("\n").map(l => l.trim()).filter(l => l);
// // // // // //     const nameMatch = lines.length > 0 ? lines[0] : "";
// // // // // //     return {
// // // // // //       name: nameMatch || "",
// // // // // //       email: emailMatch ? emailMatch[0] : "",
// // // // // //       phone: phoneMatch ? phoneMatch[0] : ""
// // // // // //     };
// // // // // //   };

// // // // // //   const handleFile = async (file) => {
// // // // // //     if (!file) return false;
// // // // // //     const ext = file.name.split(".").pop().toLowerCase();
// // // // // //     let text = "";
// // // // // //     try {
// // // // // //       if (ext === "pdf") {
// // // // // //         const arrayBuffer = await file.arrayBuffer();
// // // // // //         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// // // // // //         let content = "";
// // // // // //         for (let i = 1; i <= pdf.numPages; i++) {
// // // // // //           const page = await pdf.getPage(i);
// // // // // //           const txt = await page.getTextContent();
// // // // // //           content += txt.items.map(i => i.str).join(" ") + "\n";
// // // // // //         }
// // // // // //         text = content;
// // // // // //       } else if (ext === "docx") {
// // // // // //         const arrayBuffer = await file.arrayBuffer();
// // // // // //         const result = await mammoth.extractRawText({ arrayBuffer });
// // // // // //         text = result.value;
// // // // // //       } else {
// // // // // //         message.error("Unsupported file type.");
// // // // // //         return false;
// // // // // //       }

// // // // // //       const extracted = extractFieldsFromText(text);
// // // // // //       setFields(extracted);
// // // // // //       setShowStartButton(true);
// // // // // //       message.success("Resume parsed. Please verify your details!");
// // // // // //     } catch (err) {
// // // // // //       console.error(err);
// // // // // //       message.error("Failed to parse resume. Please fill fields manually.");
// // // // // //       setShowStartButton(true);
// // // // // //     }
// // // // // //     return false;
// // // // // //   };

// // // // // //   /** ----------------- Quiz Handling ----------------- **/
// // // // // //   const startQuiz = () => {
// // // // // //     if (!fields.name.trim() || !fields.email.trim() || !fields.phone.trim()) {
// // // // // //       message.error("Please fill Name, Email, and Phone before starting!");
// // // // // //       return;
// // // // // //     }
// // // // // //     setQuizStarted(true);
// // // // // //     setCurrentQ(0);
// // // // // //     setAnswers([]);
// // // // // //     setTimeLeft(questions[0].time);
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     if (!quizStarted || showSummary) return;
// // // // // //     if (timeLeft <= 0) {
// // // // // //       handleNext(null);
// // // // // //       return;
// // // // // //     }
// // // // // //     const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
// // // // // //     return () => clearInterval(timer);
// // // // // //   }, [timeLeft, quizStarted, showSummary]);

// // // // // //   const handleNext = (selectedIndex) => {
// // // // // //     const q = questions[currentQ];
// // // // // //     setAnswers(prev => [...prev, { ...q, selected: selectedIndex }]);
// // // // // //     const nextQ = currentQ + 1;
// // // // // //     if (nextQ < questions.length) {
// // // // // //       setCurrentQ(nextQ);
// // // // // //       setTimeLeft(questions[nextQ].time);
// // // // // //     } else {
// // // // // //       setQuizStarted(false);
// // // // // //       setShowSummary(true);
// // // // // //     }
// // // // // //   };

// // // // // //   /** ----------------- Summary PDF ----------------- **/
// // // // // //   const downloadSummary = () => {
// // // // // //     const doc = new jsPDF();
// // // // // //     doc.setFontSize(16);
// // // // // //     doc.text(`Quiz Summary - ${fields.name}`, 10, 20);
// // // // // //     let y = 30;
// // // // // //     answers.forEach((a, i) => {
// // // // // //       doc.setFontSize(12);
// // // // // //       doc.text(`${i + 1}. ${a.text}`, 10, y);
// // // // // //       y += 6;
// // // // // //       a.options.forEach((opt, idx) => {
// // // // // //         const prefix = idx === a.answer ? "(Correct) " : "";
// // // // // //         const sel = idx === a.selected ? "(Your answer) " : "";
// // // // // //         doc.text(`   ${prefix}${sel}${opt}`, 10, y);
// // // // // //         y += 6;
// // // // // //       });
// // // // // //       y += 4;
// // // // // //     });
// // // // // //     const correct = answers.filter(a => a.selected === a.answer).length;
// // // // // //     doc.text(`Total Score: ${correct} / ${questions.length}`, 10, y+10);
// // // // // //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// // // // // //   };

// // // // // //   /** ----------------- Render ----------------- **/
// // // // // //   if (!quizStarted && !showSummary) {
// // // // // //     return (
// // // // // //       <div style={{ minHeight: "100vh", display:"flex", justifyContent:"center", alignItems:"center", background: "linear-gradient(to right,#667eea,#764ba2)", padding:20 }}>
// // // // // //         <Card style={{ maxWidth:800,width:"100%",borderRadius:15,boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white" }}>
// // // // // //           <Title level={2} style={{ textAlign:"center" }}>Welcome to Fullstack Developer Quiz</Title>
// // // // // //           <Paragraph style={{ textAlign:"center" }}>Sharpen your React & Node skills for SWIPE, Hyderabad</Paragraph>

// // // // // //           {!showStartButton && (
// // // // // //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{ padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20 }}>
// // // // // //               <p className="ant-upload-drag-icon"><InboxOutlined style={{ fontSize:32, color:"#667eea" }} /></p>
// // // // // //               <p className="ant-upload-text">Click or drag your resume here</p>
// // // // // //               <p className="ant-upload-hint">PDF or DOCX only. Fields auto-extracted if possible.</p>
// // // // // //             </Dragger>
// // // // // //           )}

// // // // // //           {showStartButton && (
// // // // // //             <Card style={{ borderRadius:10, padding:20 }}>
// // // // // //               <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name", e.target.value)} style={{ marginBottom:10 }} />
// // // // // //               <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email", e.target.value)} style={{ marginBottom:10 }} />
// // // // // //               <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone", e.target.value)} style={{ marginBottom:20 }} />
// // // // // //               <Button type="primary" size="large" block onClick={startQuiz} style={{ background:"linear-gradient(to right,#667eea,#764ba2)", border:"none" }}>Start Quiz</Button>
// // // // // //             </Card>
// // // // // //           )}
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   if (quizStarted) {
// // // // // //     const q = questions[currentQ];
// // // // // //     return (
// // // // // //       <div style={{ padding:20 }}>
// // // // // //         <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
// // // // // //           <Paragraph>{q.text}</Paragraph>
// // // // // //           <Radio.Group onChange={e => handleNext(e.target.value)} value={null} style={{ display:"flex", flexDirection:"column" }}>
// // // // // //             {q.options.map((opt,i) => <Radio.Button key={i} value={i} style={{ marginBottom:10 }}>{opt}</Radio.Button>)}
// // // // // //           </Radio.Group>
// // // // // //           <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{ marginTop:10 }} />
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   if (showSummary) {
// // // // // //     const correctCount = answers.filter(a=>a.selected===a.answer).length;
// // // // // //     const wrongCount = questions.length - correctCount;
// // // // // //     const pieData = [
// // // // // //       { name:`Correct (${correctCount})`, value: correctCount },
// // // // // //       { name:`Wrong (${wrongCount})`, value: wrongCount }
// // // // // //     ];

// // // // // //     return (
// // // // // //       <div style={{ padding:20 }}>
// // // // // //         <Card title={`Summary for ${fields.name}`}>
// // // // // //           <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
// // // // // //           <PieChart width={400} height={250}>
// // // // // //             <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
// // // // // //               {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
// // // // // //             </Pie>
// // // // // //             <Tooltip />
// // // // // //             <Legend />
// // // // // //           </PieChart>
// // // // // //           <Button type="primary" onClick={downloadSummary} style={{ marginTop:20 }}>Download Summary PDF</Button>
// // // // // //           <Card style={{ marginTop:20, backgroundColor:"#f0f0f0" }}>
// // // // // //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// // // // // //           </Card>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   return null;
// // // // // // }


// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import { useDispatch } from "react-redux";
// // // // // import { addCandidate, updateAnswer, finishCandidate } from "../store/candidatesSlice";
// // // // // import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
// // // // // import { InboxOutlined } from "@ant-design/icons";
// // // // // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // // // // import { v4 as uuidv4 } from "uuid";
// // // // // import jsPDF from "jspdf";

// // // // // const { Dragger } = Upload;
// // // // // const { Title, Paragraph } = Typography;
// // // // // const COLORS = ["#00C49F", "#FF8042"];

// // // // // // 6 MCQs for Fullstack (React/Node)
// // // // // const questions = [
// // // // //   { id:1, level:"Easy", text:"Which of the following is a correct way to create a React functional component?", options:["function MyComponent() { return <h1>Hello</h1>; }","component MyComponent() { return 'Hello'; }","new ReactComponent() { return <div>Hello</div>; }","class MyComponent extends Function {}"], answer:0, time:20 },
// // // // //   { id:2, level:"Easy", text:"Which HTML tag is used to link an external CSS file?", options:["<script>","<link>","<style>","<css>"], answer:1, time:20 },
// // // // //   { id:3, level:"Medium", text:"In MongoDB, which query finds all users whose age is greater than 25?", options:["db.users.find({age: 25})","db.users.find({age: {$gt: 25}})","db.users.find({age > 25})","db.users.get({age: >25})"], answer:1, time:60 },
// // // // //   { id:4, level:"Medium", text:"Which of the following is true about CSS Flexbox?", options:["justify-content aligns items along the cross axis","align-items aligns items along the main axis","flex-direction can be row or column","Flexbox is only for horizontal alignment"], answer:2, time:60 },
// // // // //   { id:5, level:"Hard", text:`Node.js/Express: What will be the output of this code when accessing /hello?\nconst express = require('express');\nconst app = express();\napp.get('/hello',(req,res)=>{res.send('Hello World');});\napp.listen(3000,()=>console.log('Server running'));`, options:["Server crashes","Hello World","undefined","404 Error"], answer:1, time:120 },
// // // // //   { id:6, level:"Hard", text:`React/JSX: What will be rendered?\nimport React,{useState} from 'react';\nfunction Counter(){const [count,setCount]=useState(0);return(<div><p>{count}</p><button onClick={()=>setCount(count+1)}>Increment</button></div>);}`, options:["Always shows 0","Shows 0 initially, increases by 1 on each click","Shows 'count' text","Button will not work"], answer:1, time:120 }
// // // // // ];

// // // // // export default function Interviewee() {
// // // // //   const dispatch = useDispatch();
// // // // //   const candidateId = useRef(uuidv4());

// // // // //   const [fields,setFields] = useState({name:"",email:"",phone:""});
// // // // //   const [showStartButton,setShowStartButton] = useState(false);
// // // // //   const [quizStarted,setQuizStarted] = useState(false);
// // // // //   const [currentQ,setCurrentQ] = useState(0);
// // // // //   const [answers,setAnswers] = useState([]);
// // // // //   const [timeLeft,setTimeLeft] = useState(0);
// // // // //   const [showSummary,setShowSummary] = useState(false);

// // // // //   const handleFieldChange = (k,v)=>setFields(prev=>({...prev,[k]:v}));

// // // // //   /** Extract from resume (simplified for now) **/
// // // // //   const extractFieldsFromText = text=>{
// // // // //     const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/);
// // // // //     const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}/);
// // // // //     const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);
// // // // //     let name="";
// // // // //     for (let line of lines.slice(0,3)){
// // // // //       if(/^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line)){ name=line; break; }
// // // // //     }
// // // // //     return {name:name||"", email:emailMatch?emailMatch[0]:"", phone:phoneMatch?phoneMatch[0]:""};
// // // // //   }

// // // // //   const handleFile = async file=>{
// // // // //     if(!file) return false;
// // // // //     const ext = file.name.split(".").pop().toLowerCase();
// // // // //     try{
// // // // //       let text="";
// // // // //       if(ext==="pdf"){ text = "dummy pdf text with Name John Doe\nemail test@test.com\nPhone 9876543210"; } // mock
// // // // //       else if(ext==="docx"){ text = "dummy docx text with Name Jane Smith\nemail jane@test.com\nPhone 9123456780"; }
// // // // //       const extracted = extractFieldsFromText(text);
// // // // //       setFields(extracted);
// // // // //       setShowStartButton(true);
// // // // //       message.success("Resume parsed. Verify your details.");
// // // // //     }catch(e){message.error("Failed parsing. Fill manually."); setShowStartButton(true);}
// // // // //     return false;
// // // // //   }

// // // // //   /** Quiz Logic **/
// // // // //   const startQuiz=()=>{
// // // // //     if(!fields.name.trim()||!fields.email.trim()||!fields.phone.trim()){ message.error("Fill all fields!"); return;}
// // // // //     dispatch(addCandidate({id:candidateId.current, profile:fields}));
// // // // //     setQuizStarted(true); setCurrentQ(0); setAnswers([]); setTimeLeft(questions[0].time);
// // // // //   }

// // // // //   useEffect(()=>{
// // // // //     if(!quizStarted||showSummary) return;
// // // // //     if(timeLeft<=0){handleNext(null); return;}
// // // // //     const timer = setInterval(()=>setTimeLeft(t=>t-1),1000);
// // // // //     return ()=>clearInterval(timer);
// // // // //   },[timeLeft,quizStarted,showSummary]);

// // // // //   const handleNext=selectedIndex=>{
// // // // //     const q = questions[currentQ];
// // // // //     const answerObj = {...q, selected:selectedIndex};
// // // // //     setAnswers(prev=>[...prev,answerObj]);
// // // // //     dispatch(updateAnswer({id:candidateId.current, answer:answerObj}));
// // // // //     const nextQ = currentQ+1;
// // // // //     if(nextQ<questions.length){ setCurrentQ(nextQ); setTimeLeft(questions[nextQ].time);}
// // // // //     else{
// // // // //       setQuizStarted(false); setShowSummary(true);
// // // // //       const score = [...answers,answerObj].filter(a=>a.selected===a.answer).length;
// // // // //       dispatch(finishCandidate({id:candidateId.current, score}));
// // // // //     }
// // // // //   }

// // // // //   const downloadSummary = ()=>{
// // // // //     const doc = new jsPDF();
// // // // //     doc.setFontSize(16); doc.text(`Quiz Summary - ${fields.name}`,10,20);
// // // // //     let y=30;
// // // // //     answers.forEach((a,i)=>{
// // // // //       doc.setFontSize(12); doc.text(`${i+1}. ${a.text}`,10,y); y+=6;
// // // // //       a.options.forEach((opt,idx)=>{
// // // // //         const prefix = idx===a.answer?"(Correct) ":"";
// // // // //         const sel = idx===a.selected?"(Your answer) ":"";
// // // // //         doc.text(`   ${prefix}${sel}${opt}`,10,y); y+=6;
// // // // //       }); y+=4;
// // // // //     });
// // // // //     const correct = answers.filter(a=>a.selected===a.answer).length;
// // // // //     doc.text(`Total Score: ${correct} / ${questions.length}`,10,y+10);
// // // // //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// // // // //   }

// // // // //   /** Rendering **/
// // // // //   if(!quizStarted&&!showSummary){
// // // // //     return(
// // // // //       <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(to right,#667eea,#764ba2)", padding:20}}>
// // // // //         <Card style={{maxWidth:800,width:"100%",borderRadius:15, boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white"}}>
// // // // //           <Title level={2} style={{textAlign:"center"}}>Welcome to Fullstack Developer Quiz</Title>
// // // // //           <Paragraph style={{textAlign:"center"}}>Sharpen your React & Node skills for SWIPE, Hyderabad</Paragraph>

// // // // //           {!showStartButton&&(
// // // // //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20}}>
// // // // //               <p className="ant-upload-drag-icon"><InboxOutlined style={{fontSize:32, color:"#667eea"}}/></p>
// // // // //               <p className="ant-upload-text">Click or drag your resume here</p>
// // // // //               <p className="ant-upload-hint">PDF or DOCX only.</p>
// // // // //             </Dragger>
// // // // //           )}

// // // // //           {showStartButton&&(
// // // // //             <Card style={{borderRadius:10, padding:20}}>
// // // // //               <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name",e.target.value)} style={{marginBottom:10}} />
// // // // //               <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email",e.target.value)} style={{marginBottom:10}} />
// // // // //               <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone",e.target.value)} style={{marginBottom:20}} />
// // // // //               <Button type="primary" size="large" block onClick={startQuiz} style={{background:"linear-gradient(to right,#667eea,#764ba2)", border:"none"}}>Start Quiz</Button>
// // // // //             </Card>
// // // // //           )}
// // // // //         </Card>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   if(quizStarted){
// // // // //     const q = questions[currentQ];
// // // // //     return(
// // // // //       <div style={{padding:20}}>
// // // // //         <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
// // // // //           <Paragraph>{q.text}</Paragraph>
// // // // //           <Radio.Group onChange={e=>handleNext(e.target.value)} value={null} style={{display:"flex", flexDirection:"column"}}>
// // // // //             {q.options.map((opt,i)=><Radio.Button key={i} value={i} style={{marginBottom:10}}>{opt}</Radio.Button>)}
// // // // //           </Radio.Group>
// // // // //           <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{marginTop:10}} />
// // // // //         </Card>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   if(showSummary){
// // // // //     const correctCount = answers.filter(a=>a.selected===a.answer).length;
// // // // //     const wrongCount = questions.length-correctCount;
// // // // //     const pieData = [{name:`Correct (${correctCount})`, value:correctCount},{name:`Wrong (${wrongCount})`, value:wrongCount}];

// // // // //     return(
// // // // //       <div style={{padding:20}}>
// // // // //         <Card title={`Summary for ${fields.name}`}>
// // // // //           <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
// // // // //           <PieChart width={400} height={250}>
// // // // //             <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
// // // // //               {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
// // // // //             </Pie>
// // // // //             <Tooltip />
// // // // //             <Legend />
// // // // //           </PieChart>
// // // // //           <Button type="primary" onClick={downloadSummary} style={{marginTop:20}}>Download Summary PDF</Button>
// // // // //           <Card style={{marginTop:20, backgroundColor:"#f0f0f0"}}>
// // // // //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// // // // //           </Card>
// // // // //         </Card>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   return null;
// // // // // }


// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import { useDispatch } from "react-redux";
// // // // import { addCandidate, updateAnswer, finishCandidate } from "../store/candidatesSlice";
// // // // import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
// // // // import { InboxOutlined } from "@ant-design/icons";
// // // // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // // // import { v4 as uuidv4 } from "uuid";
// // // // import jsPDF from "jspdf";

// // // // const { Dragger } = Upload;
// // // // const { Title, Paragraph } = Typography;
// // // // const COLORS = ["#00C49F", "#FF8042"];

// // // // const questions = [
// // // //   { id:1, level:"Easy", text:"Which of the following is a correct way to create a React functional component?", options:["function MyComponent() { return <h1>Hello</h1>; }","component MyComponent() { return 'Hello'; }","new ReactComponent() { return <div>Hello</div>; }","class MyComponent extends Function {}"], answer:0, time:20 },
// // // //   { id:2, level:"Easy", text:"Which HTML tag is used to link an external CSS file?", options:["<script>","<link>","<style>","<css>"], answer:1, time:20 },
// // // //   { id:3, level:"Medium", text:"In MongoDB, which query finds all users whose age is greater than 25?", options:["db.users.find({age: 25})","db.users.find({age: {$gt: 25}})","db.users.find({age > 25})","db.users.get({age: >25})"], answer:1, time:60 },
// // // //   { id:4, level:"Medium", text:"Which of the following is true about CSS Flexbox?", options:["justify-content aligns items along the cross axis","align-items aligns items along the main axis","flex-direction can be row or column","Flexbox is only for horizontal alignment"], answer:2, time:60 },
// // // //   { id:5, level:"Hard", text:`Node.js/Express: What will be the output of this code when accessing /hello?\nconst express = require('express');\nconst app = express();\napp.get('/hello',(req,res)=>{res.send('Hello World');});\napp.listen(3000,()=>console.log('Server running'));`, options:["Server crashes","Hello World","undefined","404 Error"], answer:1, time:120 },
// // // //   { id:6, level:"Hard", text:`React/JSX: What will be rendered?\nimport React,{useState} from 'react';\nfunction Counter(){const [count,setCount]=useState(0);return(<div><p>{count}</p><button onClick={()=>setCount(count+1)}>Increment</button></div>);}`, options:["Always shows 0","Shows 0 initially, increases by 1 on each click","Shows 'count' text","Button will not work"], answer:1, time:120 }
// // // // ];

// // // // export default function Interviewee() {
// // // //   const dispatch = useDispatch();
// // // //   const candidateId = useRef(uuidv4());

// // // //   const [fields,setFields] = useState({name:"",email:"",phone:""});
// // // //   const [showStartButton,setShowStartButton] = useState(false);
// // // //   const [quizStarted,setQuizStarted] = useState(false);
// // // //   const [currentQ,setCurrentQ] = useState(0);
// // // //   const [answers,setAnswers] = useState([]);
// // // //   const [timeLeft,setTimeLeft] = useState(0);
// // // //   const [showSummary,setShowSummary] = useState(false);

// // // //   const handleFieldChange = (k,v)=>setFields(prev=>({...prev,[k]:v}));

// // // //   const extractFieldsFromText = text=>{
// // // //     const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/);
// // // //     const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}/);
// // // //     const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);
// // // //     let name="";
// // // //     for (let line of lines.slice(0,3)){
// // // //       if(/^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line)){ name=line; break; }
// // // //     }
// // // //     return {name:name||"", email:emailMatch?emailMatch[0]:"", phone:phoneMatch?phoneMatch[0]:""};
// // // //   }

// // // //   const handleFile = async file=>{
// // // //     if(!file) return false;
// // // //     const ext = file.name.split(".").pop().toLowerCase();
// // // //     try{
// // // //       let text="";
// // // //       if(ext==="pdf"){ text = "Name John Doe\nemail test@test.com\nPhone 9876543210"; } 
// // // //       else if(ext==="docx"){ text = "Name Jane Smith\nemail jane@test.com\nPhone 9123456780"; }
// // // //       const extracted = extractFieldsFromText(text);
// // // //       setFields(extracted);
// // // //       setShowStartButton(true);
// // // //       message.success("Resume parsed. Verify your details.");
// // // //     }catch(e){message.error("Failed parsing. Fill manually."); setShowStartButton(true);}
// // // //     return false;
// // // //   }

// // // //   const startQuiz=()=>{
// // // //     if(!fields.name.trim()||!fields.email.trim()||!fields.phone.trim()){ message.error("Fill all fields!"); return;}
// // // //     dispatch(addCandidate({id:candidateId.current, profile:fields}));
// // // //     setQuizStarted(true); setCurrentQ(0); setAnswers([]); setTimeLeft(questions[0].time);
// // // //   }

// // // //   useEffect(()=>{
// // // //     if(!quizStarted||showSummary) return;
// // // //     if(timeLeft<=0){handleNext(null); return;}
// // // //     const timer = setInterval(()=>setTimeLeft(t=>t-1),1000);
// // // //     return ()=>clearInterval(timer);
// // // //   },[timeLeft,quizStarted,showSummary]);

// // // //   const handleNext=selectedIndex=>{
// // // //     const q = questions[currentQ];
// // // //     const answerObj = {...q, selected:selectedIndex};
// // // //     setAnswers(prev=>[...prev,answerObj]);
// // // //     dispatch(updateAnswer({id:candidateId.current, answer:answerObj}));
// // // //     const nextQ = currentQ+1;
// // // //     if(nextQ<questions.length){ setCurrentQ(nextQ); setTimeLeft(questions[nextQ].time);}
// // // //     else{
// // // //       setQuizStarted(false); setShowSummary(true);
// // // //       const score = [...answers,answerObj].filter(a=>a.selected===a.answer).length;
// // // //       dispatch(finishCandidate({id:candidateId.current, score}));
// // // //     }
// // // //   }

// // // //   const downloadSummary = ()=>{
// // // //     const doc = new jsPDF();
// // // //     doc.setFontSize(16); doc.text(`Quiz Summary - ${fields.name}`,10,20);
// // // //     let y=30;
// // // //     answers.forEach((a,i)=>{
// // // //       doc.setFontSize(12); doc.text(`${i+1}. ${a.text}`,10,y); y+=6;
// // // //       a.options.forEach((opt,idx)=>{
// // // //         const prefix = idx===a.answer?"(Correct) ":"";
// // // //         const sel = idx===a.selected?"(Your answer) ":"";
// // // //         doc.text(`   ${prefix}${sel}${opt}`,10,y); y+=6;
// // // //       }); y+=4;
// // // //     });
// // // //     const correct = answers.filter(a=>a.selected===a.answer).length;
// // // //     doc.text(`Total Score: ${correct} / ${questions.length}`,10,y+10);
// // // //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// // // //   }

// // // //   if(!quizStarted&&!showSummary){
// // // //     return(
// // // //       <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(to right,#667eea,#764ba2)", padding:20}}>
// // // //         <Card style={{maxWidth:800,width:"100%",borderRadius:15, boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white"}}>
// // // //           <Title level={2} style={{textAlign:"center"}}>Welcome to Fullstack Developer Quiz</Title>
// // // //           <Paragraph style={{textAlign:"center"}}>Sharpen your React & Node skills for SWIPE, Hyderabad</Paragraph>

// // // //           {!showStartButton&&(
// // // //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20}}>
// // // //               <p className="ant-upload-drag-icon"><InboxOutlined style={{fontSize:32, color:"#667eea"}}/></p>
// // // //               <p className="ant-upload-text">Click or drag your resume here</p>
// // // //               <p className="ant-upload-hint">PDF or DOCX only.</p>
// // // //             </Dragger>
// // // //           )}

// // // //           {showStartButton&&(
// // // //             <Card style={{borderRadius:10, padding:20}}>
// // // //               <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name",e.target.value)} style={{marginBottom:10}} />
// // // //               <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email",e.target.value)} style={{marginBottom:10}} />
// // // //               <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone",e.target.value)} style={{marginBottom:20}} />
// // // //               <Button type="primary" size="large" block onClick={startQuiz} style={{background:"linear-gradient(to right,#667eea,#764ba2)", border:"none"}}>Start Quiz</Button>
// // // //             </Card>
// // // //           )}
// // // //         </Card>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if(quizStarted){
// // // //     const q = questions[currentQ];
// // // //     return(
// // // //       <div style={{padding:20}}>
// // // //         <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
// // // //           <Paragraph>{q.text}</Paragraph>
// // // //           <Radio.Group onChange={e=>handleNext(e.target.value)} value={null} style={{display:"flex", flexDirection:"column"}}>
// // // //             {q.options.map((opt,i)=><Radio.Button key={i} value={i} style={{marginBottom:10}}>{opt}</Radio.Button>)}
// // // //           </Radio.Group>
// // // //           <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{marginTop:10}} />
// // // //         </Card>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if(showSummary){
// // // //     const correctCount = answers.filter(a=>a.selected===a.answer).length;
// // // //     const wrongCount = questions.length-correctCount;
// // // //     const pieData = [{name:`Correct (${correctCount})`, value:correctCount},{name:`Wrong (${wrongCount})`, value:wrongCount}];

// // // //     return(
// // // //       <div style={{padding:20}}>
// // // //         <Card title={`Summary for ${fields.name}`}>
// // // //           <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
// // // //           <PieChart width={400} height={250}>
// // // //             <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
// // // //               {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
// // // //             </Pie>
// // // //             <Tooltip />
// // // //             <Legend />
// // // //           </PieChart>
// // // //           <Button type="primary" onClick={downloadSummary} style={{marginTop:20}}>Download Summary PDF</Button>
// // // //           <Card style={{marginTop:20, backgroundColor:"#f0f0f0"}}>
// // // //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// // // //           </Card>
// // // //         </Card>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return null;
// // // // }


// // // import React, { useState, useEffect, useRef } from "react";
// // // import { useDispatch } from "react-redux";
// // // import { addCandidate, updateAnswer, finishCandidate } from "../store/candidatesSlice";
// // // import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
// // // import { InboxOutlined } from "@ant-design/icons";
// // // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // // import { v4 as uuidv4 } from "uuid";
// // // import jsPDF from "jspdf";

// // // const { Dragger } = Upload;
// // // const { Title, Paragraph } = Typography;
// // // const COLORS = ["#00C49F", "#FF8042"];

// // // // Fullstack 6 MCQs
// // // const questions = [
// // //   { id:1, level:"Easy", text:"Which of the following is a correct way to create a React functional component?", options:["function MyComponent() { return <h1>Hello</h1>; }","component MyComponent() { return 'Hello'; }","new ReactComponent() { return <div>Hello</div>; }","class MyComponent extends Function {}"], answer:0, time:20 },
// // //   { id:2, level:"Easy", text:"Which HTML tag is used to link an external CSS file?", options:["<script>","<link>","<style>","<css>"], answer:1, time:20 },
// // //   { id:3, level:"Medium", text:"In MongoDB, which query finds all users whose age is greater than 25?", options:["db.users.find({age: 25})","db.users.find({age: {$gt: 25}})","db.users.find({age > 25})","db.users.get({age: >25})"], answer:1, time:60 },
// // //   { id:4, level:"Medium", text:"Which of the following is true about CSS Flexbox?", options:["justify-content aligns items along the cross axis","align-items aligns items along the main axis","flex-direction can be row or column","Flexbox is only for horizontal alignment"], answer:2, time:60 },
// // //   { id:5, level:"Hard", text:`Node.js/Express: What will be the output of this code when accessing /hello?\nconst express = require('express');\nconst app = express();\napp.get('/hello',(req,res)=>{res.send('Hello World');});\napp.listen(3000,()=>console.log('Server running'));`, options:["Server crashes","Hello World","undefined","404 Error"], answer:1, time:120 },
// // //   { id:6, level:"Hard", text:`React/JSX: What will be rendered?\nimport React,{useState} from 'react';\nfunction Counter(){const [count,setCount]=useState(0);return(<div><p>{count}</p><button onClick={()=>setCount(count+1)}>Increment</button></div>);}`, options:["Always shows 0","Shows 0 initially, increases by 1 on each click","Shows 'count' text","Button will not work"], answer:1, time:120 }
// // // ];

// // // export default function Interviewee() {
// // //   const dispatch = useDispatch();
// // //   const candidateId = useRef(uuidv4());

// // //   const [fields,setFields] = useState({name:"",email:"",phone:""});
// // //   const [showStartButton,setShowStartButton] = useState(false);
// // //   const [quizStarted,setQuizStarted] = useState(false);
// // //   const [currentQ,setCurrentQ] = useState(0);
// // //   const [answers,setAnswers] = useState([]);
// // //   const [timeLeft,setTimeLeft] = useState(0);
// // //   const [showSummary,setShowSummary] = useState(false);

// // //   const handleFieldChange = (k,v)=>setFields(prev=>({...prev,[k]:v}));

// // //   // Improved extraction
// // // const extractFieldsFromText = text => {
// // //   const lines = text.split("\n").map(l => l.trim()).filter(l => l);

// // //   // Email
// // //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
// // //   const email = emailMatch ? emailMatch[0] : "";

// // //   // Phone
// // //   const phoneMatch = text.match(/(\+?\d{1,3}[-.\s()]*)?\d{10}/);
// // //   const phone = phoneMatch ? phoneMatch[0] : "";

// // //   // Name
// // //   let name = "";
// // //   for (let line of lines) {
// // //     if (line.match(/\d/)) continue;
// // //     if (line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)) continue;
// // //     if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("email")) continue;
// // //     if(line.length>2 && line.length<50){ name=line; break; }
// // //   }

// // //   return { name, email, phone };
// // // };


// // //   const handleFile = async file=>{
// // //     if(!file) return false;
// // //     const ext = file.name.split(".").pop().toLowerCase();
// // //     try{
// // //       let text="";
// // //       if(ext==="pdf"){ text="John Doe\nemail john@test.com\nPhone 9876543210"; }
// // //       else if(ext==="docx"){ text="Jane Smith\nemail jane@test.com\nPhone 9123456780"; }
// // //       const extracted = extractFieldsFromText(text);
// // //       setFields(extracted);
// // //       setShowStartButton(true);
// // //       if(!extracted.name || !extracted.email || !extracted.phone) message.warning("Some fields missing. Please fill manually.");
// // //       else message.success("Resume parsed successfully.");
// // //     }catch(e){ message.error("Failed parsing. Fill manually."); setShowStartButton(true);}
// // //     return false;
// // //   };

// // //   // Quiz
// // //   const startQuiz = ()=>{
// // //     if(!fields.name || !fields.email || !fields.phone){ message.error("Fill all fields!"); return;}
// // //     dispatch(addCandidate({id:candidateId.current, profile:fields}));
// // //     setQuizStarted(true); setCurrentQ(0); setAnswers([]); setTimeLeft(questions[0].time);
// // //   };

// // //   useEffect(()=>{
// // //     if(!quizStarted || showSummary) return;
// // //     if(timeLeft<=0){handleNext(null); return;}
// // //     const timer = setInterval(()=>setTimeLeft(t=>t-1),1000);
// // //     return ()=>clearInterval(timer);
// // //   },[timeLeft,quizStarted,showSummary]);

// // //   const handleNext = selectedIndex=>{
// // //     const q = questions[currentQ];
// // //     const answerObj = {...q, selected:selectedIndex};
// // //     setAnswers(prev=>[...prev,answerObj]);
// // //     dispatch(updateAnswer({id:candidateId.current, answer:answerObj}));
// // //     const nextQ = currentQ+1;
// // //     if(nextQ<questions.length){ setCurrentQ(nextQ); setTimeLeft(questions[nextQ].time); }
// // //     else{
// // //       setQuizStarted(false); setShowSummary(true);
// // //       const score = [...answers,answerObj].filter(a=>a.selected===a.answer).length;
// // //       dispatch(finishCandidate({id:candidateId.current, score}));
// // //     }
// // //   };

// // //   const downloadSummary = ()=>{
// // //     const doc = new jsPDF();
// // //     doc.setFontSize(16); doc.text(`Quiz Summary - ${fields.name}`,10,20);
// // //     let y=30;
// // //     answers.forEach((a,i)=>{
// // //       doc.setFontSize(12); doc.text(`${i+1}. ${a.text}`,10,y); y+=6;
// // //       a.options.forEach((opt,idx)=>{
// // //         const prefix = idx===a.answer?"(Correct) ":"";
// // //         const sel = idx===a.selected?"(Your answer) ":"";
// // //         doc.text(`   ${prefix}${sel}${opt}`,10,y); y+=6;
// // //       }); y+=4;
// // //     });
// // //     const correct = answers.filter(a=>a.selected===a.answer).length;
// // //     doc.text(`Total Score: ${correct} / ${questions.length}`,10,y+10);
// // //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// // //   };

// // //   // Render
// // //   if(!quizStarted && !showSummary){
// // //     return(
// // //       <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(to right,#667eea,#764ba2)", padding:20}}>
// // //         <Card style={{maxWidth:800,width:"100%",borderRadius:15, boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white"}}>
// // //           <Title level={2} style={{textAlign:"center"}}>Welcome to Fullstack Developer Quiz</Title>
// // //           <Paragraph style={{textAlign:"center"}}>Sharpen your React & Node skills for SWIPE, Hyderabad</Paragraph>

// // //           {!showStartButton && (
// // //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20}}>
// // //               <p className="ant-upload-drag-icon"><InboxOutlined style={{fontSize:32, color:"#667eea"}}/></p>
// // //               <p className="ant-upload-text">Click or drag your resume here</p>
// // //               <p className="ant-upload-hint">PDF or DOCX only.</p>
// // //             </Dragger>
// // //           )}

// // //           {showStartButton && (
// // //             <Card style={{borderRadius:10, padding:20}}>
// // //               <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name",e.target.value)} style={{marginBottom:10}} />
// // //               <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email",e.target.value)} style={{marginBottom:10}} />
// // //               <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone",e.target.value)} style={{marginBottom:20}} />
// // //               <Button type="primary" size="large" block onClick={startQuiz} style={{background:"linear-gradient(to right,#667eea,#764ba2)", border:"none"}}>Start Quiz</Button>
// // //             </Card>
// // //           )}
// // //         </Card>
// // //       </div>
// // //     )
// // //   }

// // //   if(quizStarted){
// // //     const q = questions[currentQ];
// // //     return(
// // //       <div style={{padding:20}}>
// // //         <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
// // //           <Paragraph>{q.text}</Paragraph>
// // //           <Radio.Group onChange={e=>handleNext(e.target.value)} value={null} style={{display:"flex", flexDirection:"column"}}>
// // //             {q.options.map((opt,i)=><Radio.Button key={i} value={i} style={{marginBottom:10}}>{opt}</Radio.Button>)}
// // //           </Radio.Group>
// // //           <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{marginTop:10}} />
// // //         </Card>
// // //       </div>
// // //     )
// // //   }

// // //   if(showSummary){
// // //     const correctCount = answers.filter(a=>a.selected===a.answer).length;
// // //     const wrongCount = questions.length-correctCount;
// // //     const pieData = [{name:`Correct (${correctCount})`, value:correctCount},{name:`Wrong (${wrongCount})`, value:wrongCount}];

// // //     return(
// // //       <div style={{padding:20}}>
// // //         <Card title={`Summary for ${fields.name}`}>
// // //           <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
// // //           <PieChart width={400} height={250}>
// // //             <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
// // //               {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
// // //             </Pie>
// // //             <Tooltip />
// // //             <Legend />
// // //           </PieChart>
// // //           <Button type="primary" onClick={downloadSummary} style={{marginTop:20}}>Download Summary PDF</Button>
// // //           <Card style={{marginTop:20, backgroundColor:"#f0f0f0"}}>
// // //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// // //           </Card>
// // //         </Card>
// // //       </div>
// // //     )
// // //   }

// // //   return null;
// // // }


// // import React, { useState, useEffect, useRef } from "react";
// // import { useDispatch } from "react-redux";
// // import { addCandidate, updateAnswer, finishCandidate } from "../store/candidatesSlice";
// // import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
// // import { InboxOutlined } from "@ant-design/icons";
// // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // import { v4 as uuidv4 } from "uuid";
// // import jsPDF from "jspdf";
// // import * as pdfjsLib from "pdfjs-dist";
// // import mammoth from "mammoth";

// // const { Dragger } = Upload;
// // const { Title, Paragraph } = Typography;
// // const COLORS = ["#00C49F", "#FF8042"];

// // // Fullstack 6 MCQs
// // const questions = [
// //   { id:1, level:"Easy", text:"Which of the following is a correct way to create a React functional component?", options:["function MyComponent() { return <h1>Hello</h1>; }","component MyComponent() { return 'Hello'; }","new ReactComponent() { return <div>Hello</div>; }","class MyComponent extends Function {}"], answer:0, time:20 },
// //   { id:2, level:"Easy", text:"Which HTML tag is used to link an external CSS file?", options:["<script>","<link>","<style>","<css>"], answer:1, time:20 },
// //   { id:3, level:"Medium", text:"In MongoDB, which query finds all users whose age is greater than 25?", options:["db.users.find({age: 25})","db.users.find({age: {$gt: 25}})","db.users.find({age > 25})","db.users.get({age: >25})"], answer:1, time:60 },
// //   { id:4, level:"Medium", text:"Which of the following is true about CSS Flexbox?", options:["justify-content aligns items along the cross axis","align-items aligns items along the main axis","flex-direction can be row or column","Flexbox is only for horizontal alignment"], answer:2, time:60 },
// //   { id:5, level:"Hard", text:`Node.js/Express: What will be the output of this code when accessing /hello?\nconst express = require('express');\nconst app = express();\napp.get('/hello',(req,res)=>{res.send('Hello World');});\napp.listen(3000,()=>console.log('Server running'));`, options:["Server crashes","Hello World","undefined","404 Error"], answer:1, time:120 },
// //   { id:6, level:"Hard", text:`React/JSX: What will be rendered?\nimport React,{useState} from 'react';\nfunction Counter(){const [count,setCount]=useState(0);return(<div><p>{count}</p><button onClick={()=>setCount(count+1)}>Increment</button></div>);}`, options:["Always shows 0","Shows 0 initially, increases by 1 on each click","Shows 'count' text","Button will not work"], answer:1, time:120 }
// // ];

// // // PDF extraction
// // async function extractTextFromPDF(file){
// //   const arrayBuffer = await file.arrayBuffer();
// //   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
// //   let text = "";
// //   for(let i=1;i<=pdf.numPages;i++){
// //     const page = await pdf.getPage(i);
// //     const content = await page.getTextContent();
// //     text += content.items.map(item=>item.str).join(" ") + "\n";
// //   }
// //   return text;
// // }

// // // DOCX extraction
// // async function extractTextFromDocx(file){
// //   const arrayBuffer = await file.arrayBuffer();
// //   const result = await mammoth.extractRawText({ arrayBuffer });
// //   return result.value;
// // }

// // // Name, Email, Phone extraction
// // function extractFieldsFromText(text){
// //   const lines = text.split("\n").map(l=>l.trim()).filter(l=>l);

// //   const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
// //   const email = emailMatch ? emailMatch[0] : "";

// //   const phoneMatch = text.match(/(\+?\d{1,3}[-.\s()]*)?\d{10}/);
// //   const phone = phoneMatch ? phoneMatch[0] : "";

// //   let name = "";
// //   for(let line of lines){
// //     if(line.match(/\d/)) continue;
// //     if(line.toLowerCase().includes("email") || line.toLowerCase().includes("phone")) continue;
// //     if(line.length > 2 && line.length < 50){ name = line; break; }
// //   }

// //   return { name, email, phone };
// // }

// // export default function Interviewee(){
// //   const dispatch = useDispatch();
// //   const candidateId = useRef(uuidv4());

// //   const [fields,setFields] = useState({name:"",email:"",phone:""});
// //   const [showStartButton,setShowStartButton] = useState(false);
// //   const [quizStarted,setQuizStarted] = useState(false);
// //   const [currentQ,setCurrentQ] = useState(0);
// //   const [answers,setAnswers] = useState([]);
// //   const [timeLeft,setTimeLeft] = useState(0);
// //   const [showSummary,setShowSummary] = useState(false);

// //   const handleFieldChange = (k,v)=>setFields(prev=>({...prev,[k]:v}));

// //   const handleFile = async file=>{
// //     if(!file) return false;
// //     const ext = file.name.split(".").pop().toLowerCase();
// //     let text="";
// //     try{
// //       if(ext==="pdf") text = await extractTextFromPDF(file);
// //       else if(ext==="docx") text = await extractTextFromDocx(file);
// //       else throw new Error("Unsupported format");

// //       const extracted = extractFieldsFromText(text);
// //       setFields(extracted);
// //       setShowStartButton(true);

// //       if(!extracted.name || !extracted.email || !extracted.phone)
// //         message.warning("Some fields could not be extracted. Please fill manually.");
// //       else
// //         message.success("Resume parsed successfully.");
// //     }catch(e){
// //       message.error("Failed parsing resume. Please fill manually.");
// //       setShowStartButton(true);
// //     }
// //     return false;
// //   }

// //   const startQuiz = ()=>{
// //     if(!fields.name || !fields.email || !fields.phone){ message.error("Fill all fields!"); return;}
// //     dispatch(addCandidate({id:candidateId.current, profile:fields}));
// //     setQuizStarted(true); setCurrentQ(0); setAnswers([]); setTimeLeft(questions[0].time);
// //   }

// //   useEffect(()=>{
// //     if(!quizStarted || showSummary) return;
// //     if(timeLeft<=0){handleNext(null); return;}
// //     const timer = setInterval(()=>setTimeLeft(t=>t-1),1000);
// //     return ()=>clearInterval(timer);
// //   },[timeLeft,quizStarted,showSummary]);

// //   const handleNext = selectedIndex=>{
// //     const q = questions[currentQ];
// //     const answerObj = {...q, selected:selectedIndex};
// //     setAnswers(prev=>[...prev,answerObj]);
// //     dispatch(updateAnswer({id:candidateId.current, answer:answerObj}));
// //     const nextQ = currentQ+1;
// //     if(nextQ<questions.length){ setCurrentQ(nextQ); setTimeLeft(questions[nextQ].time);}
// //     else{
// //       setQuizStarted(false); setShowSummary(true);
// //       const score = [...answers,answerObj].filter(a=>a.selected===a.answer).length;
// //       dispatch(finishCandidate({id:candidateId.current, score}));
// //     }
// //   }

// //   const downloadSummary = ()=>{
// //     const doc = new jsPDF();
// //     doc.setFontSize(16); doc.text(`Quiz Summary - ${fields.name}`,10,20);
// //     let y=30;
// //     answers.forEach((a,i)=>{
// //       doc.setFontSize(12); doc.text(`${i+1}. ${a.text}`,10,y); y+=6;
// //       a.options.forEach((opt,idx)=>{
// //         const prefix = idx===a.answer?"(Correct) ":"";
// //         const sel = idx===a.selected?"(Your answer) ":"";
// //         doc.text(`   ${prefix}${sel}${opt}`,10,y); y+=6;
// //       }); y+=4;
// //     });
// //     const correct = answers.filter(a=>a.selected===a.answer).length;
// //     doc.text(`Total Score: ${correct} / ${questions.length}`,10,y+10);
// //     doc.save(`Quiz_Summary_${fields.name}.pdf`);
// //   }

// //   if(!quizStarted && !showSummary){
// //     return(
// //       <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(to right,#667eea,#764ba2)", padding:20}}>
// //         <Card style={{maxWidth:800,width:"100%",borderRadius:15, boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white"}}>
// //           <Title level={2} style={{textAlign:"center"}}>Welcome to Fullstack Developer Quiz</Title>
// //           <Paragraph style={{textAlign:"center"}}>Sharpen your React & Node skills for SWIPE, Hyderabad</Paragraph>

// //           {!showStartButton && (
// //             <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20}}>
// //               <p className="ant-upload-drag-icon"><InboxOutlined style={{fontSize:32, color:"#667eea"}}/></p>
// //               <p className="ant-upload-text">Click or drag your resume here</p>
// //               <p className="ant-upload-hint">PDF or DOCX only.</p>
// //             </Dragger>
// //           )}

// //           {showStartButton && (
// //             <Card style={{borderRadius:10, padding:20}}>
// //               <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name",e.target.value)} style={{marginBottom:10}} />
// //               <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email",e.target.value)} style={{marginBottom:10}} />
// //               <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone",e.target.value)} style={{marginBottom:20}} />
// //               <Button type="primary" size="large" block onClick={startQuiz} style={{background:"linear-gradient(to right,#667eea,#764ba2)", border:"none"}}>Start Quiz</Button>
// //             </Card>
// //           )}
// //         </Card>
// //       </div>
// //     )
// //   }

// //   if(quizStarted){
// //     const q = questions[currentQ];
// //     return(
// //       <div style={{padding:20}}>
// //         <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
// //           <Paragraph>{q.text}</Paragraph>
// //           <Radio.Group onChange={e=>handleNext(e.target.value)} value={null} style={{display:"flex", flexDirection:"column"}}>
// //             {q.options.map((opt,i)=><Radio.Button key={i} value={i} style={{marginBottom:10}}>{opt}</Radio.Button>)}
// //           </Radio.Group>
// //           <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{marginTop:10}} />
// //         </Card>
// //       </div>
// //     )
// //   }

// //   if(showSummary){
// //     const correctCount = answers.filter(a=>a.selected===a.answer).length;
// //     const wrongCount = questions.length-correctCount;
// //     const pieData = [{name:`Correct (${correctCount})`, value:correctCount},{name:`Wrong (${wrongCount})`, value:wrongCount}];

// //     return(
// //       <div style={{padding:20}}>
// //         <Card title={`Summary for ${fields.name}`}>
// //           <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
// //           <PieChart width={400} height={250}>
// //             <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
// //               {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
// //             </Pie>
// //             <Tooltip />
// //             <Legend />
// //           </PieChart>
// //           <Button type="primary" onClick={downloadSummary} style={{marginTop:20}}>Download Summary PDF</Button>
// //           <Card style={{marginTop:20, backgroundColor:"#f0f0f0"}}>
// //             <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
// //           </Card>
// //         </Card>
// //       </div>
// //     )
// //   }

// //   return null;
// // }


import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCandidate, updateAnswer, finishCandidate } from "../store/candidatesSlice";
import { Upload, Button, Card, Input, Typography, message, Radio, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";
import mammoth from "mammoth";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;
const COLORS = ["#00C49F", "#FF8042"];

// Fullstack 6 MCQs
const questions = [
  { id:1, level:"Easy", text:"Which of the following is a correct way to create a React functional component?", options:["function MyComponent() { return <h1>Hello</h1>; }","component MyComponent() { return 'Hello'; }","new ReactComponent() { return <div>Hello</div>; }","class MyComponent extends Function {}"], answer:0, time:20 },
  { id:2, level:"Easy", text:"Which HTML tag is used to link an external CSS file?", options:["<script>","<link>","<style>","<css>"], answer:1, time:20 },
  { id:3, level:"Medium", text:"In MongoDB, which query finds all users whose age is greater than 25?", options:["db.users.find({age: 25})","db.users.find({age: {$gt: 25}})","db.users.find({age > 25})","db.users.get({age: >25})"], answer:1, time:60 },
  { id:4, level:"Medium", text:"Which of the following is true about CSS Flexbox?", options:["justify-content aligns items along the cross axis","align-items aligns items along the main axis","flex-direction can be row or column","Flexbox is only for horizontal alignment"], answer:2, time:60 },
  { id:5, level:"Hard", text:`Node.js/Express: What will be the output of this code when accessing /hello?\nconst express = require('express');\nconst app = express();\napp.get('/hello',(req,res)=>{res.send('Hello World');});\napp.listen(3000,()=>console.log('Server running'));`, options:["Server crashes","Hello World","undefined","404 Error"], answer:1, time:120 },
  { id:6, level:"Hard", text:`React/JSX: What will be rendered?\nimport React,{useState} from 'react';\nfunction Counter(){const [count,setCount]=useState(0);return(<div><p>{count}</p><button onClick={()=>setCount(count+1)}>Increment</button></div>);}`, options:["Always shows 0","Shows 0 initially, increases by 1 on each click","Shows 'count' text","Button will not work"], answer:1, time:120 }
];

// PDF extraction
const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
};

// DOCX extraction
const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

// Extract name, email, phone
const extractFieldsFromText = (text) => {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s()]*)?\d{10}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  let name = "";
  for (let line of lines) {
    if (line.match(/\d/)) continue;
    if (line.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)) continue;
    if (line.toLowerCase().includes("phone") || line.toLowerCase().includes("email")) continue;
    if(line.length>2 && line.length<50){ name=line; break; }
  }

  return { name, email, phone };
};

export default function Interviewee() {
  const dispatch = useDispatch();
  const candidateId = useRef(uuidv4());

  const [fields, setFields] = useState({ name:"", email:"", phone:"" });
  const [showStartButton, setShowStartButton] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleFieldChange = (k, v) => setFields(prev => ({...prev,[k]:v}));

  const handleFile = async (file) => {
    if(!file) return false;
    try {
      let text = "";
      if(file.name.endsWith(".pdf")) text = await extractTextFromPDF(file);
      else if(file.name.endsWith(".docx")) text = await extractTextFromDocx(file);
      else throw new Error("Unsupported file type");

      const extracted = extractFieldsFromText(text);
      setFields(extracted);
      setShowStartButton(true);
      if(!extracted.name || !extracted.email || !extracted.phone)
        message.warning("Some fields missing. Please fill manually.");
      else
        message.success("Resume parsed successfully!");
    } catch (err) {
      message.error("Failed parsing resume. Fill manually.");
      setShowStartButton(true);
    }
    return false;
  };

  const startQuiz = () => {
    if(!fields.name || !fields.email || !fields.phone){ message.error("Fill all fields!"); return;}
    dispatch(addCandidate({id:candidateId.current, profile:fields}));
    setQuizStarted(true); setCurrentQ(0); setAnswers([]); setTimeLeft(questions[0].time);
  };

  useEffect(()=>{
    if(!quizStarted || showSummary) return;
    if(timeLeft <= 0){ handleNext(null); return; }
    const timer = setInterval(()=>setTimeLeft(t=>t-1), 1000);
    return ()=>clearInterval(timer);
  }, [timeLeft, quizStarted, showSummary]);

  const handleNext = (selectedIndex) => {
    const q = questions[currentQ];
    const answerObj = {...q, selected: selectedIndex};
    setAnswers(prev => [...prev, answerObj]);
    dispatch(updateAnswer({id:candidateId.current, answer:answerObj}));
    const nextQ = currentQ + 1;
    if(nextQ < questions.length){ setCurrentQ(nextQ); setTimeLeft(questions[nextQ].time); }
    else{
      setQuizStarted(false); setShowSummary(true);
      const score = [...answers, answerObj].filter(a => a.selected===a.answer).length;
      dispatch(finishCandidate({id:candidateId.current, score}));
    }
  };

  const downloadSummary = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text(`Quiz Summary - ${fields.name}`,10,20);
    let y=30;
    answers.forEach((a,i)=>{
      doc.setFontSize(12); doc.text(`${i+1}. ${a.text}`,10,y); y+=6;
      a.options.forEach((opt,idx)=>{
        const prefix = idx===a.answer?"(Correct) ":"";
        const sel = idx===a.selected?"(Your answer) ":"";
        doc.text(`   ${prefix}${sel}${opt}`,10,y); y+=6;
      }); y+=4;
    });
    const correct = answers.filter(a=>a.selected===a.answer).length;
    doc.text(`Total Score: ${correct} / ${questions.length}`,10,y+10);
    doc.save(`Quiz_Summary_${fields.name}.pdf`);
  };

  // Render UI
  if(!quizStarted && !showSummary){
    return (
      <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(to right,#667eea,#764ba2)", padding:20}}>
        <Card style={{maxWidth:800, width:"100%", borderRadius:15, boxShadow:"0 8px 20px rgba(0,0,0,0.2)", padding:30, backgroundColor:"white"}}>
          <Title level={2} style={{textAlign:"center"}}>Welcome to Fullstack Developer Quiz</Title>
          <Paragraph style={{ 
  textAlign: "center", 
  maxWidth: "700px", 
  margin: "20px auto", 
  lineHeight: "1.6", 
  fontSize: "16px" 
}}>
  Get ready to sharpen your <strong>React & Node.js</strong> skills and prove your coding prowess! 💻✨<br />
  This quiz is specially designed for <strong>SWIPE, Hyderabad</strong>, challenging you with a mix of <strong>easy, medium, and hard questions</strong>—from frontend magic to backend mastery.<br /><br />
  💡 <strong>Tip:</strong> Focus, think like a full-stack ninja, and remember: each question is a step closer to real-world coding excellence.<br /><br />
  Are you ready to level up your skills and show Hyderabad what a <strong>Full Stack Developer</strong> can do? Let’s go by uploading the Resume! 🚀
</Paragraph>

          {!showStartButton && (
            <Dragger accept=".pdf,.docx" beforeUpload={handleFile} multiple={false} showUploadList={false} style={{padding:30, border:"2px dashed #667eea", borderRadius:10, backgroundColor:"#f7f7f7", marginBottom:20}}>
              <p className="ant-upload-drag-icon"><InboxOutlined style={{fontSize:32, color:"#667eea"}}/></p>
              <p className="ant-upload-text">Click or drag your resume here</p>
              <p className="ant-upload-hint">PDF or DOCX only.</p>
            </Dragger>
          )}

          {showStartButton && (
            <Card style={{borderRadius:10, padding:20}}>
              <Input placeholder="Name" value={fields.name} onChange={e=>handleFieldChange("name",e.target.value)} style={{marginBottom:10}} />
              <Input placeholder="Email" value={fields.email} onChange={e=>handleFieldChange("email",e.target.value)} style={{marginBottom:10}} />
              <Input placeholder="Phone" value={fields.phone} onChange={e=>handleFieldChange("phone",e.target.value)} style={{marginBottom:20}} />
              <Button type="primary" size="large" block onClick={startQuiz} style={{background:"linear-gradient(to right,#667eea,#764ba2)", border:"none"}}>Start Quiz</Button>
            </Card>
          )}
        </Card>
      </div>
    );
  }

  if(quizStarted){
    const q = questions[currentQ];
    return (
      <div style={{padding:20}}>
        <Card title={`Question ${currentQ+1} (${q.level}) - Time Left: ${timeLeft}s`}>
          <Paragraph>{q.text}</Paragraph>
          <Radio.Group onChange={e=>handleNext(e.target.value)} value={null} style={{display:"flex", flexDirection:"column"}}>
            {q.options.map((opt,i)=><Radio.Button key={i} value={i} style={{marginBottom:10}}>{opt}</Radio.Button>)}
          </Radio.Group>
          <Progress percent={Math.round((timeLeft/q.time)*100)} status="active" style={{marginTop:10}} />
        </Card>
      </div>
    );
  }

  if(showSummary){
    const correctCount = answers.filter(a=>a.selected===a.answer).length;
    const wrongCount = questions.length - correctCount;
    const pieData = [{name:`Correct (${correctCount})`, value:correctCount},{name:`Wrong (${wrongCount})`, value:wrongCount}];

    return (
      <div style={{padding:20}}>
        <Card title={`Summary for ${fields.name}`}>
          <Paragraph>Total Score: {correctCount} / {questions.length}</Paragraph>
          <PieChart width={400} height={250}>
            <Pie dataKey="value" data={pieData} cx={200} cy={125} outerRadius={80} label>
              {pieData.map((entry,index)=><Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <Button type="primary" onClick={downloadSummary} style={{marginTop:20}}>Download Summary PDF</Button>
          <Card style={{marginTop:20, backgroundColor:"#f0f0f0"}}>
            <Paragraph><b>Keep pushing your Fullstack skills!</b> "The expert in anything was once a beginner."</Paragraph>
          </Card>
        </Card>
      </div>
    );
  }

  return null;
}
