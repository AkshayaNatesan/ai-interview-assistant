// // // // // // // // // // import React, { useRef, useState } from 'react'
// // // // // // // // // // import { Button, Upload, message } from 'antd'
// // // // // // // // // // import { UploadOutlined } from '@ant-design/icons'
// // // // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume'

// // // // // // // // // // export default function ResumeUploader({ onParsed }) {
// // // // // // // // // //   const [loading, setLoading] = useState(false)

// // // // // // // // // //   const beforeUpload = (file) => {
// // // // // // // // // //     const ok = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
// // // // // // // // // //     if (!ok) message.error('Only PDF or DOCX allowed')
// // // // // // // // // //     return ok || Upload.LIST_IGNORE
// // // // // // // // // //   }

// // // // // // // // // //   const handleFile = async ({ file }) => {
// // // // // // // // // //     setLoading(true)
// // // // // // // // // //     try {
// // // // // // // // // //       let text = ''
// // // // // // // // // //       if (file.type === 'application/pdf') text = await extractTextFromPDF(file.originFileObj)
// // // // // // // // // //       else text = await extractTextFromDocx(file.originFileObj)
// // // // // // // // // //       const fields = extractFields(text || '')
// // // // // // // // // //       onParsed(fields, text)
// // // // // // // // // //     } catch (e) {
// // // // // // // // // //       console.error(e)
// // // // // // // // // //       message.error('Failed to parse resume. Try a different file.')
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <Upload showUploadList={false} beforeUpload={beforeUpload} customRequest={handleFile} accept=".pdf,.docx">
// // // // // // // // // //       <Button icon={<UploadOutlined />} loading={loading}>Upload Resume (PDF required)</Button>
// // // // // // // // // //     </Upload>
// // // // // // // // // //   )
// // // // // // // // // // }

// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { Upload, Button, message, Tabs, Spin, Modal, Input } from 'antd';
// // // // // // // // // import { UploadOutlined } from '@ant-design/icons';
// // // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // // // // // // export default function ResumeUploader({ onCandidateReady }) {
// // // // // // // // //   const [parsedData, setParsedData] = useState(null);
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [missingFields, setMissingFields] = useState({});
// // // // // // // // //   const [modalVisible, setModalVisible] = useState(false);

// // // // // // // // //   // Check allowed types
// // // // // // // // //   const beforeUpload = (file) => {
// // // // // // // // //     const allowed =
// // // // // // // // //       file.type === 'application/pdf' ||
// // // // // // // // //       file.type ===
// // // // // // // // //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // // // // // // // //     if (!allowed) message.error('Only PDF or DOCX allowed');
// // // // // // // // //     return allowed || Upload.LIST_IGNORE;
// // // // // // // // //   };

// // // // // // // // //   // Handle file upload
// // // // // // // // //   const handleFile = async (options) => {
// // // // // // // // //     setLoading(true);
// // // // // // // // //     try {
// // // // // // // // //       const uploadedFile = options.file?.originFileObj || options.file;
// // // // // // // // //       if (!uploadedFile) throw new Error('No file provided');

// // // // // // // // //       let text = '';
// // // // // // // // //       if (uploadedFile.type === 'application/pdf') {
// // // // // // // // //         text = await extractTextFromPDF(uploadedFile);
// // // // // // // // //       } else {
// // // // // // // // //         text = await extractTextFromDocx(uploadedFile);
// // // // // // // // //       }

// // // // // // // // //       const fields = extractFields(text || '');
// // // // // // // // //       setParsedData({ ...fields, rawText: text });

// // // // // // // // //       // Check for missing fields
// // // // // // // // //       const missing = {};
// // // // // // // // //       if (!fields.name) missing.name = '';
// // // // // // // // //       if (!fields.email) missing.email = '';
// // // // // // // // //       if (!fields.phone) missing.phone = '';

// // // // // // // // //       if (Object.keys(missing).length > 0) {
// // // // // // // // //         setMissingFields(missing);
// // // // // // // // //         setModalVisible(true);
// // // // // // // // //       } else {
// // // // // // // // //         message.success('Resume parsed successfully!');
// // // // // // // // //         onCandidateReady && onCandidateReady(fields); // callback to start interview
// // // // // // // // //       }
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error('Parsing error:', err);
// // // // // // // // //       message.error(err.message || 'Failed to parse resume.');
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //     return false; // prevent default upload
// // // // // // // // //   };

// // // // // // // // //   // Handle filling missing fields
// // // // // // // // //   const handleModalOk = () => {
// // // // // // // // //     const updatedData = { ...parsedData, ...missingFields };
// // // // // // // // //     setParsedData(updatedData);
// // // // // // // // //     setModalVisible(false);
// // // // // // // // //     message.success('All fields are now filled!');
// // // // // // // // //     onCandidateReady && onCandidateReady(updatedData);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <Upload
// // // // // // // // //         showUploadList={false}
// // // // // // // // //         beforeUpload={beforeUpload}
// // // // // // // // //         customRequest={handleFile}
// // // // // // // // //         accept=".pdf,.docx"
// // // // // // // // //       >
// // // // // // // // //         <Button icon={<UploadOutlined />} loading={loading}>
// // // // // // // // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // // // // // // // //         </Button>
// // // // // // // // //       </Upload>

// // // // // // // // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // // // // // // // //       {parsedData && (
// // // // // // // // //         <Tabs
// // // // // // // // //           style={{ marginTop: 20 }}
// // // // // // // // //           items={[
// // // // // // // // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // // // // // // // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // // // // // // // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // // // // // // // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // // // // // // // //           ]}
// // // // // // // // //         />
// // // // // // // // //       )}

// // // // // // // // //       {/* Modal for missing fields */}
// // // // // // // // //       <Modal
// // // // // // // // //         title="Fill Missing Fields"
// // // // // // // // //         visible={modalVisible}
// // // // // // // // //         onOk={handleModalOk}
// // // // // // // // //         onCancel={() => setModalVisible(false)}
// // // // // // // // //         okText="Submit"
// // // // // // // // //       >
// // // // // // // // //         {Object.keys(missingFields).map((key) => (
// // // // // // // // //           <div key={key} style={{ marginBottom: 12 }}>
// // // // // // // // //             <label style={{ display: 'block', marginBottom: 4 }}>{key.toUpperCase()}</label>
// // // // // // // // //             <Input
// // // // // // // // //               value={missingFields[key]}
// // // // // // // // //               onChange={(e) =>
// // // // // // // // //                 setMissingFields({ ...missingFields, [key]: e.target.value })
// // // // // // // // //               }
// // // // // // // // //               placeholder={`Enter ${key}`}
// // // // // // // // //             />
// // // // // // // // //           </div>
// // // // // // // // //         ))}
// // // // // // // // //       </Modal>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }


// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import { Upload, Button, message, Tabs, Spin, Modal, Input } from 'antd';
// // // // // // // // import { UploadOutlined } from '@ant-design/icons';
// // // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // // // // // export default function ResumeUploader({ onCandidateReady }) {
// // // // // // // //   const [parsedData, setParsedData] = useState(null);
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [missingFields, setMissingFields] = useState({});
// // // // // // // //   const [modalOpen, setModalOpen] = useState(false); // Changed from modalVisible to modalOpen

// // // // // // // //   // Check allowed types
// // // // // // // //   const beforeUpload = (file) => {
// // // // // // // //     const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
// // // // // // // //     const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
// // // // // // // //                    file.name.toLowerCase().endsWith('.docx');
    
// // // // // // // //     if (!isPdf && !isDocx) {
// // // // // // // //       message.error('Only PDF or DOCX files are allowed!');
// // // // // // // //       return Upload.LIST_IGNORE;
// // // // // // // //     }
// // // // // // // //     return true;
// // // // // // // //   };

// // // // // // // //   // Handle file upload
// // // // // // // //   const handleFile = async (options) => {
// // // // // // // //     const { file, onSuccess, onError } = options;
// // // // // // // //     setLoading(true);
    
// // // // // // // //     try {
// // // // // // // //       const uploadedFile = file;
// // // // // // // //       if (!uploadedFile) throw new Error('No file provided');

// // // // // // // //       let text = '';
// // // // // // // //       if (uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf')) {
// // // // // // // //         text = await extractTextFromPDF(uploadedFile);
// // // // // // // //       } else {
// // // // // // // //         text = await extractTextFromDocx(uploadedFile);
// // // // // // // //       }

// // // // // // // //       const fields = extractFields(text || '');
// // // // // // // //       setParsedData({ ...fields, rawText: text });

// // // // // // // //       // Check for missing fields
// // // // // // // //       const missing = {};
// // // // // // // //       if (!fields.name) missing.name = '';
// // // // // // // //       if (!fields.email) missing.email = '';
// // // // // // // //       if (!fields.phone) missing.phone = '';

// // // // // // // //       if (Object.keys(missing).length > 0) {
// // // // // // // //         setMissingFields(missing);
// // // // // // // //         setModalOpen(true);
// // // // // // // //         onSuccess?.('File uploaded successfully');
// // // // // // // //       } else {
// // // // // // // //         message.success('Resume parsed successfully!');
// // // // // // // //         onCandidateReady?.(fields);
// // // // // // // //         onSuccess?.('File uploaded successfully');
// // // // // // // //       }
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error('Parsing error:', err);
// // // // // // // //       const errorMsg = err.message || 'Failed to parse resume.';
// // // // // // // //       message.error(errorMsg);
// // // // // // // //       onError?.(err);
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Handle filling missing fields
// // // // // // // //   const handleModalOk = () => {
// // // // // // // //     const updatedData = { ...parsedData, ...missingFields };
// // // // // // // //     setParsedData(updatedData);
// // // // // // // //     setModalOpen(false);
// // // // // // // //     message.success('All fields are now filled!');
// // // // // // // //     onCandidateReady?.(updatedData);
// // // // // // // //   };

// // // // // // // //   const handleModalCancel = () => {
// // // // // // // //     setModalOpen(false);
// // // // // // // //     setMissingFields({});
// // // // // // // //   };

// // // // // // // //   const tabItems = [
// // // // // // // //     { 
// // // // // // // //       key: 'name', 
// // // // // // // //       label: 'Name', 
// // // // // // // //       children: <div>{parsedData?.name || 'N/A'}</div> 
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       key: 'email', 
// // // // // // // //       label: 'Email', 
// // // // // // // //       children: <div>{parsedData?.email || 'N/A'}</div> 
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       key: 'phone', 
// // // // // // // //       label: 'Phone', 
// // // // // // // //       children: <div>{parsedData?.phone || 'N/A'}</div> 
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       key: 'raw', 
// // // // // // // //       label: 'Raw Text', 
// // // // // // // //       children: <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{parsedData?.rawText}</pre> 
// // // // // // // //     },
// // // // // // // //   ];

// // // // // // // //   return (
// // // // // // // //     <div style={{ padding: '20px' }}>
// // // // // // // //       <Upload
// // // // // // // //         showUploadList={false}
// // // // // // // //         beforeUpload={beforeUpload}
// // // // // // // //         customRequest={handleFile}
// // // // // // // //         accept=".pdf,.docx"
// // // // // // // //         multiple={false}
// // // // // // // //       >
// // // // // // // //         <Button icon={<UploadOutlined />} loading={loading} size="large">
// // // // // // // //           {loading ? 'Parsing Resume...' : 'Upload Resume (PDF/DOCX)'}
// // // // // // // //         </Button>
// // // // // // // //       </Upload>

// // // // // // // //       {loading && (
// // // // // // // //         <div style={{ textAlign: 'center', marginTop: 20 }}>
// // // // // // // //           <Spin tip="Parsing resume..." size="large" />
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {parsedData && !loading && (
// // // // // // // //         <Tabs
// // // // // // // //           style={{ marginTop: 20 }}
// // // // // // // //           items={tabItems}
// // // // // // // //           defaultActiveKey="name"
// // // // // // // //         />
// // // // // // // //       )}

// // // // // // // //       {/* Modal for missing fields - Updated for Antd v5 */}
// // // // // // // //       <Modal
// // // // // // // //         title="Fill Missing Fields"
// // // // // // // //         open={modalOpen} // Changed from visible to open
// // // // // // // //         onOk={handleModalOk}
// // // // // // // //         onCancel={handleModalCancel}
// // // // // // // //         okText="Submit"
// // // // // // // //         cancelText="Cancel"
// // // // // // // //         maskClosable={false}
// // // // // // // //       >
// // // // // // // //         <p>Please fill in the following missing information:</p>
// // // // // // // //         {Object.keys(missingFields).map((key) => (
// // // // // // // //           <div key={key} style={{ marginBottom: 16 }}>
// // // // // // // //             <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
// // // // // // // //               {key.charAt(0).toUpperCase() + key.slice(1)}
// // // // // // // //             </label>
// // // // // // // //             <Input
// // // // // // // //               value={missingFields[key]}
// // // // // // // //               onChange={(e) =>
// // // // // // // //                 setMissingFields({ ...missingFields, [key]: e.target.value })
// // // // // // // //               }
// // // // // // // //               placeholder={`Enter ${key}`}
// // // // // // // //               size="large"
// // // // // // // //             />
// // // // // // // //           </div>
// // // // // // // //         ))}
// // // // // // // //       </Modal>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // import React, { useState } from 'react';
// // // // // // // import { Upload, Button, message, Tabs, Spin, Modal, Input } from 'antd';
// // // // // // // import { UploadOutlined } from '@ant-design/icons';
// // // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // // // // export default function ResumeUploader({ onCandidateReady }) {
// // // // // // //   const [parsedData, setParsedData] = useState(null);
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [missingFields, setMissingFields] = useState({});
// // // // // // //   const [modalVisible, setModalVisible] = useState(false);

// // // // // // //   const beforeUpload = (file) => {
// // // // // // //     const allowed =
// // // // // // //       file.type === 'application/pdf' ||
// // // // // // //       file.type ===
// // // // // // //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // // // // // //     if (!allowed) message.error('Only PDF or DOCX allowed');
// // // // // // //     return allowed || Upload.LIST_IGNORE;
// // // // // // //   };

// // // // // // //   const handleFile = async (options) => {
// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const uploadedFile = options.file?.originFileObj || options.file;
// // // // // // //       if (!uploadedFile) throw new Error('No file provided');

// // // // // // //       let text = '';
// // // // // // //       if (uploadedFile.type === 'application/pdf') {
// // // // // // //         text = await extractTextFromPDF(uploadedFile);
// // // // // // //       } else {
// // // // // // //         text = await extractTextFromDocx(uploadedFile);
// // // // // // //       }

// // // // // // //       const fields = extractFields(text || '');
// // // // // // //       setParsedData({ ...fields, rawText: text });

// // // // // // //       // Detect missing fields
// // // // // // //       const missing = {};
// // // // // // //       if (!fields.name) missing.name = '';
// // // // // // //       if (!fields.email) missing.email = '';
// // // // // // //       if (!fields.phone) missing.phone = '';

// // // // // // //       if (Object.keys(missing).length > 0) {
// // // // // // //         setMissingFields(missing);
// // // // // // //         setModalVisible(true);
// // // // // // //       } else {
// // // // // // //         message.success('Resume parsed successfully!');
// // // // // // //         onCandidateReady && onCandidateReady(fields);
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       console.error('Parsing error:', err);
// // // // // // //       message.error(err.message || 'Failed to parse resume.');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //     return false; // prevent default upload
// // // // // // //   };

// // // // // // //   const handleModalOk = () => {
// // // // // // //     const updatedData = { ...parsedData, ...missingFields };
// // // // // // //     setParsedData(updatedData);
// // // // // // //     setModalVisible(false);
// // // // // // //     message.success('All fields are now filled!');
// // // // // // //     onCandidateReady && onCandidateReady(updatedData);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <Upload
// // // // // // //         showUploadList={false}
// // // // // // //         beforeUpload={beforeUpload}
// // // // // // //         customRequest={handleFile}
// // // // // // //         accept=".pdf,.docx"
// // // // // // //       >
// // // // // // //         <Button icon={<UploadOutlined />} loading={loading}>
// // // // // // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // // // // // //         </Button>
// // // // // // //       </Upload>

// // // // // // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // // // // // //       {parsedData && (
// // // // // // //         <Tabs
// // // // // // //           style={{ marginTop: 20 }}
// // // // // // //           items={[
// // // // // // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // // // // // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // // // // // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // // // // // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // // // // // //           ]}
// // // // // // //         />
// // // // // // //       )}

// // // // // // //       <Modal
// // // // // // //         title="Fill Missing Fields"
// // // // // // //         open={modalVisible}  // AntD v5 uses `open` instead of `visible`
// // // // // // //         onOk={handleModalOk}
// // // // // // //         onCancel={() => setModalVisible(false)}
// // // // // // //         okText="Submit"
// // // // // // //       >
// // // // // // //         {Object.keys(missingFields).map((key) => (
// // // // // // //           <div key={key} style={{ marginBottom: 12 }}>
// // // // // // //             <label style={{ display: 'block', marginBottom: 4 }}>{key.toUpperCase()}</label>
// // // // // // //             <Input
// // // // // // //               value={missingFields[key]}
// // // // // // //               onChange={(e) =>
// // // // // // //                 setMissingFields({ ...missingFields, [key]: e.target.value })
// // // // // // //               }
// // // // // // //               placeholder={`Enter ${key}`}
// // // // // // //             />
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //       </Modal>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // import React, { useState } from 'react';
// // // // // // import { Upload, Button, message, Tabs, Spin } from 'antd';
// // // // // // import { UploadOutlined } from '@ant-design/icons';
// // // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // // // export default function ResumeUploader() {
// // // // // //   const [parsedData, setParsedData] = useState(null);
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   // Only allow PDF or DOCX
// // // // // //   const beforeUpload = (file) => {
// // // // // //     const allowed =
// // // // // //       file.type === 'application/pdf' ||
// // // // // //       file.type ===
// // // // // //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // // // // //     if (!allowed) message.error('Only PDF or DOCX allowed');
// // // // // //     return allowed || Upload.LIST_IGNORE;
// // // // // //   };

// // // // // //   // Handle file upload safely
// // // // // //   const handleFile = async (options) => {
// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       const uploadedFile = options.file?.originFileObj || options.file;
// // // // // //       if (!uploadedFile) throw new Error('No file provided');

// // // // // //       let text = '';
// // // // // //       if (uploadedFile.type === 'application/pdf') {
// // // // // //         text = await extractTextFromPDF(uploadedFile);
// // // // // //       } else {
// // // // // //         text = await extractTextFromDocx(uploadedFile);
// // // // // //       }

// // // // // //       const fields = extractFields(text);
// // // // // //       setParsedData({ ...fields, rawText: text });

// // // // // //       options.onSuccess?.(fields);
// // // // // //       message.success('Resume parsed successfully!');
// // // // // //     } catch (err) {
// // // // // //       console.error('Parsing error:', err);
// // // // // //       options.onError?.(err);
// // // // // //       message.error(err.message || 'Failed to parse resume.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //     return false; // prevent default upload
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <Upload
// // // // // //         showUploadList={false}
// // // // // //         beforeUpload={beforeUpload}
// // // // // //         customRequest={handleFile}
// // // // // //         accept=".pdf,.docx"
// // // // // //       >
// // // // // //         <Button icon={<UploadOutlined />} loading={loading}>
// // // // // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // // // // //         </Button>
// // // // // //       </Upload>

// // // // // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // // // // //       {parsedData && (
// // // // // //         <Tabs
// // // // // //           style={{ marginTop: 20 }}
// // // // // //           items={[
// // // // // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // // // // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // // // // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // // // // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // // // // //           ]}
// // // // // //         />
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }


// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { Upload, Button, message, Input, Spin, Tabs, Modal } from 'antd';
// // // // // import { UploadOutlined } from '@ant-design/icons';
// // // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // // export default function ResumeUploader({ onCandidateReady }) {
// // // // //   const [parsedData, setParsedData] = useState(null);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [missingFields, setMissingFields] = useState([]);
// // // // //   const [modalVisible, setModalVisible] = useState(false);

// // // // //   const beforeUpload = (file) => {
// // // // //     const allowed =
// // // // //       file.type === 'application/pdf' ||
// // // // //       file.type ===
// // // // //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // // // //     if (!allowed) message.error('Only PDF or DOCX files are allowed.');
// // // // //     return allowed || Upload.LIST_IGNORE;
// // // // //   };

// // // // //   const handleFile = async ({ file }) => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const uploadedFile = file?.originFileObj;
// // // // //       if (!uploadedFile) throw new Error('No file provided');

// // // // //       let text = '';
// // // // //       if (uploadedFile.type === 'application/pdf') {
// // // // //         text = await extractTextFromPDF(uploadedFile);
// // // // //       } else {
// // // // //         text = await extractTextFromDocx(uploadedFile);
// // // // //       }

// // // // //       const fields = extractFields(text);
// // // // //       setParsedData({ ...fields, rawText: text });

// // // // //       // Check for missing fields
// // // // //       const missing = [];
// // // // //       if (!fields.name) missing.push('name');
// // // // //       if (!fields.email) missing.push('email');
// // // // //       if (!fields.phone) missing.push('phone');

// // // // //       if (missing.length > 0) {
// // // // //         setMissingFields(missing);
// // // // //         setModalVisible(true); // ask user to fill missing info
// // // // //       } else {
// // // // //         message.success('Resume parsed successfully!');
// // // // //         onCandidateReady(fields); // ready to start interview
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error('Parsing error:', err);
// // // // //       message.error('Failed to parse resume. Make sure it is a valid PDF or DOCX.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //     return false; // prevent default upload
// // // // //   };

// // // // //   const handleModalOk = () => {
// // // // //     const updated = { ...parsedData };
// // // // //     missingFields.forEach((f) => {
// // // // //       const input = document.getElementById(`input-${f}`);
// // // // //       if (input?.value) updated[f] = input.value;
// // // // //     });
// // // // //     setParsedData(updated);
// // // // //     setModalVisible(false);
// // // // //     message.success('Profile updated!');
// // // // //     onCandidateReady(updated);
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <Upload
// // // // //         showUploadList={false}
// // // // //         beforeUpload={beforeUpload}
// // // // //         customRequest={handleFile}
// // // // //         accept=".pdf,.docx"
// // // // //       >
// // // // //         <Button icon={<UploadOutlined />} loading={loading}>
// // // // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // // // //         </Button>
// // // // //       </Upload>

// // // // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // // // //       {parsedData && (
// // // // //         <Tabs
// // // // //           style={{ marginTop: 20 }}
// // // // //           items={[
// // // // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // // // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // // // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // // // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // // // //           ]}
// // // // //         />
// // // // //       )}

// // // // //       <Modal
// // // // //         title="Missing Fields"
// // // // //         open={modalVisible}
// // // // //         onOk={handleModalOk}
// // // // //         onCancel={() => setModalVisible(false)}
// // // // //       >
// // // // //         <p>Please fill in the missing information:</p>
// // // // //         {missingFields.map((f) => (
// // // // //           <div key={f} style={{ marginBottom: 10 }}>
// // // // //             <label>{f.charAt(0).toUpperCase() + f.slice(1)}: </label>
// // // // //             <Input id={`input-${f}`} placeholder={`Enter ${f}`} />
// // // // //           </div>
// // // // //         ))}
// // // // //       </Modal>
// // // // //     </div>
// // // // //   );
// // // // // }



// // // // import React, { useState } from 'react';
// // // // import { Upload, Button, message, Tabs, Spin, Input, Modal } from 'antd';
// // // // import { UploadOutlined } from '@ant-design/icons';
// // // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // // export default function ResumeUploader({ onResumeParsed }) {
// // // //   const [parsedData, setParsedData] = useState(null);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [missingField, setMissingField] = useState(null);
// // // //   const [modalOpen, setModalOpen] = useState(false);
// // // //   const [tempValue, setTempValue] = useState('');

// // // //   const beforeUpload = (file) => {
// // // //     const allowed = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // // //     if (!allowed) message.error('Only PDF or DOCX allowed');
// // // //     return allowed || Upload.LIST_IGNORE;
// // // //   };

// // // //   const handleFile = async (options) => {
// // // //     const file = options?.file || options?.fileList?.[0]?.originFileObj;
// // // //     if (!file) {
// // // //       message.error('No file provided');
// // // //       return;
// // // //     }
// // // //     setLoading(true);
// // // //     try {
// // // //       let text = '';
// // // //       if (file.type === 'application/pdf') text = await extractTextFromPDF(file);
// // // //       else text = await extractTextFromDocx(file);

// // // //       const fields = extractFields(text);
// // // //       setParsedData({ ...fields, rawText: text });

// // // //       // Check for missing fields
// // // //       const missing = Object.keys(fields).find(key => !fields[key] && key !== 'rawText');
// // // //       if (missing) {
// // // //         setMissingField(missing);
// // // //         setModalOpen(true);
// // // //       } else {
// // // //         message.success('Resume parsed successfully!');
// // // //         onResumeParsed?.({ ...fields, rawText: text }); // trigger interview
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('Parsing error:', err);
// // // //       message.error('Failed to parse resume. Make sure it is a valid PDF or DOCX.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //     return false;
// // // //   };

// // // //   const handleModalOk = () => {
// // // //     if (!tempValue.trim()) return message.warning('Please enter a value');
// // // //     const updatedData = { ...parsedData, [missingField]: tempValue };
// // // //     setParsedData(updatedData);
// // // //     setModalOpen(false);
// // // //     setMissingField(null);
// // // //     setTempValue('');
// // // //     message.success('Field added, starting interview...');
// // // //     onResumeParsed?.updatedData; // trigger interview
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <Upload showUploadList={false} beforeUpload={beforeUpload} customRequest={handleFile} accept=".pdf,.docx">
// // // //         <Button icon={<UploadOutlined />} loading={loading}>
// // // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // // //         </Button>
// // // //       </Upload>

// // // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // // //       {parsedData && (
// // // //         <Tabs
// // // //           style={{ marginTop: 20 }}
// // // //           items={[
// // // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // // //           ]}
// // // //         />
// // // //       )}

// // // //       <Modal
// // // //         title={`Missing ${missingField}`}
// // // //         open={modalOpen}
// // // //         onOk={handleModalOk}
// // // //         onCancel={() => setModalOpen(false)}
// // // //         okText="Submit"
// // // //       >
// // // //         <Input placeholder={`Enter ${missingField}`} value={tempValue} onChange={e => setTempValue(e.target.value)} />
// // // //       </Modal>
// // // //     </div>
// // // //   );
// // // // }


// // // import React, { useState } from 'react';
// // // import { Upload, Button, message, Tabs, Spin } from 'antd';
// // // import { UploadOutlined } from '@ant-design/icons';
// // // import { extractTextFromPDF, extractTextFromDocx, extractFields } from '../utils/parseResume';

// // // export default function ResumeUploader({ onParsed }) {
// // //   const [parsedData, setParsedData] = useState(null);
// // //   const [loading, setLoading] = useState(false);

// // //   const beforeUpload = (file) => {
// // //     const allowed =
// // //       file.type === 'application/pdf' ||
// // //       file.type ===
// // //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// // //     if (!allowed) message.error('Only PDF or DOCX allowed');
// // //     return allowed || Upload.LIST_IGNORE;
// // //   };

// // //   const handleFile = async (file) => {
// // //     setLoading(true);
// // //     try {
// // //       if (!file) throw new Error('No file provided');

// // //       let text = '';
// // //       if (file.type === 'application/pdf') {
// // //         text = await extractTextFromPDF(file);
// // //       } else {
// // //         text = await extractTextFromDocx(file);
// // //       }

// // //       const fields = extractFields(text || '');
// // //       setParsedData({ ...fields, rawText: text });
// // //       message.success('Resume parsed successfully!');

// // //       // Notify parent component (like Interview section)
// // //       if (onParsed) onParsed(fields);
// // //     } catch (err) {
// // //       console.error('Parsing error:', err);
// // //       message.error(err.message || 'Failed to parse resume.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //     return false;
// // //   };

// // //   return (
// // //     <div>
// // //       <Upload
// // //         showUploadList={false}
// // //         beforeUpload={beforeUpload}
// // //         customRequest={({ file, onSuccess }) => {
// // //           handleFile(file).then(() => onSuccess?.());
// // //         }}
// // //         accept=".pdf,.docx"
// // //       >
// // //         <Button icon={<UploadOutlined />} loading={loading}>
// // //           {loading ? 'Parsing...' : 'Upload Resume (PDF/DOCX)'}
// // //         </Button>
// // //       </Upload>

// // //       {loading && <Spin style={{ marginTop: 20 }} />}

// // //       {parsedData && (
// // //         <Tabs
// // //           style={{ marginTop: 20 }}
// // //           items={[
// // //             { label: 'Name', key: 'name', children: <div>{parsedData.name || 'N/A'}</div> },
// // //             { label: 'Email', key: 'email', children: <div>{parsedData.email || 'N/A'}</div> },
// // //             { label: 'Phone', key: 'phone', children: <div>{parsedData.phone || 'N/A'}</div> },
// // //             { label: 'Raw Text', key: 'raw', children: <pre>{parsedData.rawText}</pre> },
// // //           ]}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }



// // import React, { useState } from 'react';
// // import { Button, Input, message } from 'antd';
// // import ResumeUploader from './ResumeUploader';

// // const interviewQuestions = [
// //   "Tell me about yourself.",
// //   "What are your strengths?",
// //   "What are your weaknesses?",
// //   "Why do you want to work here?",
// //   "Describe a challenging situation you faced and how you handled it.",
// //   "Where do you see yourself in 5 years?"
// // ];

// // export default function AIInterviewAssistant() {
// //   const [candidate, setCandidate] = useState({
// //     name: '',
// //     email: '',
// //     phone: ''
// //   });
// //   const [missingFields, setMissingFields] = useState([]);
// //   const [interviewStarted, setInterviewStarted] = useState(false);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [answers, setAnswers] = useState([]);
// //   const [feedback, setFeedback] = useState('');

// //   // Called by ResumeUploader when parsing is done
// //   const handleParsedResume = (parsed) => {
// //     const { name, email, phone } = parsed;
// //     setCandidate({ name: name || '', email: email || '', phone: phone || '' });

// //     // Determine missing fields
// //     const missing = [];
// //     if (!name) missing.push('name');
// //     if (!email) missing.push('email');
// //     if (!phone) missing.push('phone');
// //     setMissingFields(missing);
// //   };

// //   const handleFieldChange = (field, value) => {
// //     setCandidate(prev => ({ ...prev, [field]: value }));
// //     setMissingFields(prev => prev.filter(f => f !== field));
// //   };

// //   const startInterview = () => {
// //     if (missingFields.length > 0) {
// //       message.error("Please fill all missing fields first!");
// //       return;
// //     }
// //     setInterviewStarted(true);
// //   };

// //   const handleAnswer = (answer) => {
// //     setAnswers(prev => [...prev, answer]);
// //     if (currentQuestionIndex < interviewQuestions.length - 1) {
// //       setCurrentQuestionIndex(prev => prev + 1);
// //     } else {
// //       message.success("Interview completed! Please provide feedback.");
// //     }
// //   };

// //   const handleFeedbackSubmit = () => {
// //     message.success("Thank you! Interview session finished.");
// //     // Reset everything for next candidate
// //     setCandidate({ name: '', email: '', phone: '' });
// //     setMissingFields([]);
// //     setInterviewStarted(false);
// //     setCurrentQuestionIndex(0);
// //     setAnswers([]);
// //     setFeedback('');
// //   };

// //   return (
// //     <div style={{ maxWidth: 600, margin: '20px auto' }}>
// //       {!interviewStarted && (
// //         <>
// //           <h2>Upload Resume</h2>
// //           <ResumeUploader onParsed={handleParsedResume} />
// //           {missingFields.length > 0 && (
// //             <div style={{ marginTop: 20 }}>
// //               <h3>Missing Information</h3>
// //               {missingFields.map(field => (
// //                 <Input
// //                   key={field}
// //                   placeholder={`Enter ${field}`}
// //                   style={{ marginBottom: 10 }}
// //                   value={candidate[field]}
// //                   onChange={e => handleFieldChange(field, e.target.value)}
// //                 />
// //               ))}
// //             </div>
// //           )}
// //           <Button
// //             type="primary"
// //             disabled={missingFields.length > 0}
// //             onClick={startInterview}
// //           >
// //             Start Interview
// //           </Button>
// //         </>
// //       )}

// //       {interviewStarted && currentQuestionIndex < interviewQuestions.length && (
// //         <div style={{ marginTop: 20 }}>
// //           <h3>Question {currentQuestionIndex + 1}:</h3>
// //           <p>{interviewQuestions[currentQuestionIndex]}</p>
// //           <Input.Search
// //             placeholder="Type your answer and press Enter"
// //             enterButton="Submit"
// //             onSearch={handleAnswer}
// //           />
// //         </div>
// //       )}

// //       {interviewStarted && currentQuestionIndex === interviewQuestions.length && (
// //         <div style={{ marginTop: 20 }}>
// //           <h3>Interview Completed! Please provide feedback:</h3>
// //           <Input.TextArea
// //             rows={4}
// //             placeholder="Your feedback..."
// //             value={feedback}
// //             onChange={e => setFeedback(e.target.value)}
// //           />
// //           <div style={{ marginTop: 10 }}>
// //             <Button
// //               type="primary"
// //               onClick={handleFeedbackSubmit}
// //               style={{ marginRight: 10 }}
// //             >
// //               Submit Feedback & Exit
// //             </Button>
// //           </div>
// //         </div>
// //       )}

// //       {candidate.name || candidate.email || candidate.phone ? (
// //         <div style={{ marginTop: 20 }}>
// //           <h3>Candidate Info</h3>
// //           <p><strong>Name:</strong> {candidate.name || 'N/A'}</p>
// //           <p><strong>Email:</strong> {candidate.email || 'N/A'}</p>
// //           <p><strong>Phone:</strong> {candidate.phone || 'N/A'}</p>
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }



// // // src/components/ResumeUploader.jsx

// // import React, { useState } from "react";
// // import { parseResume } from "../utils/parseResume";

// // export default function ResumeUploader({ onResumeParsed }) {
// //   const [resumeText, setResumeText] = useState("");
// //   const [error, setError] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleFile = async (event) => {
// //     const file = event.target.files[0];

// //     if (!file) {
// //       setError("No file selected");
// //       return;
// //     }

// //     setError("");
// //     setIsLoading(true);

// //     try {
// //       const text = await parseResume(file);

// //       if (!text || text.trim().length === 0) {
// //         throw new Error("No readable text found in resume");
// //       }

// //       setResumeText(text);
// //       onResumeParsed?.(text); // callback if parent wants parsed text
// //     } catch (err) {
// //       console.error("Parsing error:", err);
// //       setError(err.message || "Failed to parse resume");
// //       setResumeText("");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-4 border rounded-xl shadow bg-white w-full max-w-lg mx-auto">
// //       <h2 className="text-lg font-bold mb-2">Upload Resume</h2>

// //       <input
// //         type="file"
// //         accept=".pdf,.doc,.docx,.txt"
// //         onChange={handleFile}
// //         className="mb-3"
// //       />

// //       {isLoading && <p className="text-blue-500">⏳ Parsing resume...</p>}
// //       {error && <p className="text-red-500">⚠️ {error}</p>}
// //       {resumeText && !error && (
// //         <div className="mt-3 p-2 border rounded bg-gray-50 max-h-48 overflow-y-auto text-sm whitespace-pre-line">
// //           {resumeText}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // import React from "react";
// // import { Upload, message } from "antd";
// // import { InboxOutlined } from "@ant-design/icons";
// // import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";

// // const { Dragger } = Upload;

// // export default function ResumeUploader({ onParsed }) {
// //   const handleFile = async (file) => {
// //     if (!file) {
// //       message.error("No file provided");
// //       return false;
// //     }

// //     try {
// //       const fileType = file.name.split(".").pop().toLowerCase();
// //       let text = "";

// //       if (fileType === "pdf") {
// //         text = await extractTextFromPDF(file);
// //       } else if (fileType === "docx") {
// //         text = await extractTextFromDocx(file);
// //       } else {
// //         message.error("Unsupported file type. Please upload a PDF or DOCX.");
// //         return false;
// //       }

// //       if (!text || text.trim().length === 0) {
// //         message.error("Failed to extract text. Please upload a text-based resume.");
// //         return false;
// //       }

// //       const fields = extractFields(text);

// //       if (onParsed) {
// //         onParsed(fields);
// //       }

// //       message.success("Resume parsed successfully!");
// //     } catch (err) {
// //       console.error("Parsing error:", err);
// //       message.error("Failed to parse resume. Please try again with another file.");
// //     }

// //     return false; // prevent auto-upload
// //   };

// //   return (
// //     <Dragger
// //       accept=".pdf,.docx"
// //       beforeUpload={handleFile}
// //       multiple={false}
// //       showUploadList={false}
// //     >
// //       <p className="ant-upload-drag-icon">
// //         <InboxOutlined />
// //       </p>
// //       <p className="ant-upload-text">Click or drag resume to this area to upload</p>
// //       <p className="ant-upload-hint">Supports PDF or DOCX only</p>
// //     </Dragger>
// //   );
// // }


// import React, { useState } from "react";
// import { Upload, message, Button, Input, Card } from "antd";
// import { InboxOutlined } from "@ant-design/icons";
// import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";

// const { Dragger } = Upload;

// export default function ResumeUploader({ onStartQuiz }) {
//   const [fields, setFields] = useState({});
//   const [showStartButton, setShowStartButton] = useState(false);

//   const handleFile = async (file) => {
//     if (!file) {
//       message.error("No file provided");
//       return false;
//     }

//     try {
//       const fileType = file.name.split(".").pop().toLowerCase();
//       let text = "";

//       if (fileType === "pdf") text = await extractTextFromPDF(file);
//       else if (fileType === "docx") text = await extractTextFromDocx(file);
//       else {
//         message.error("Unsupported file type. Please upload a PDF or DOCX.");
//         return false;
//       }

//       if (!text || text.trim().length === 0) {
//         message.error("Failed to extract text. Please upload a text-based resume.");
//         return false;
//       }

//       const extracted = extractFields(text);
//       setFields(extracted);
//       setShowStartButton(true);
//       message.success("Resume parsed successfully!");
//     } catch (err) {
//       console.error("Parsing error:", err);
//       message.error("Failed to parse resume. Please try again with another file.");
//     }

//     return false; // prevent auto-upload
//   };

//   const handleFieldChange = (key, value) => {
//     setFields((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleStartQuiz = () => {
//     // Ensure name exists before starting
//     if (!fields.name || fields.name.trim() === "") {
//       message.error("Name is required to start the test.");
//       return;
//     }
//     onStartQuiz(fields); // Pass completed fields to parent / quiz component
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
//       {!showStartButton && (
//         <Dragger
//           accept=".pdf,.docx"
//           beforeUpload={handleFile}
//           multiple={false}
//           showUploadList={false}
//           style={{ padding: 20 }}
//         >
//           <p className="ant-upload-drag-icon">
//             <InboxOutlined />
//           </p>
//           <p className="ant-upload-text">Click or drag resume to this area to upload</p>
//           <p className="ant-upload-hint">Supports PDF or DOCX only</p>
//         </Dragger>
//       )}

//       {showStartButton && (
//         <Card title="Extracted Details" style={{ marginTop: 20 }}>
//           <Input
//             placeholder="Name"
//             value={fields.name || ""}
//             onChange={(e) => handleFieldChange("name", e.target.value)}
//             style={{ marginBottom: 10 }}
//           />
//           <Input
//             placeholder="Email"
//             value={fields.email || ""}
//             onChange={(e) => handleFieldChange("email", e.target.value)}
//             style={{ marginBottom: 10 }}
//           />
//           <Input
//             placeholder="Phone"
//             value={fields.phone || ""}
//             onChange={(e) => handleFieldChange("phone", e.target.value)}
//             style={{ marginBottom: 10 }}
//           />
//           <Button type="primary" onClick={handleStartQuiz}>
//             Start Test
//           </Button>
//         </Card>
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import { Upload, message, Button, Input, Card, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { extractTextFromPDF, extractTextFromDocx, extractFields } from "../utils/parseResume";
import aiService from "../services/aiService";

const { Dragger } = Upload;

export default function ResumeUploader({ onStartQuiz }) {
  const [fields, setFields] = useState({});
  const [showStartButton, setShowStartButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file) {
      message.error("No file provided");
      return false;
    }

    try {
      const fileType = file.name.split(".").pop().toLowerCase();
      let text = "";

      if (fileType === "pdf") text = await extractTextFromPDF(file);
      else if (fileType === "docx") text = await extractTextFromDocx(file);
      else {
        message.error("Unsupported file type. Please upload a PDF or DOCX.");
        return false;
      }

      if (!text.trim()) {
        message.error("Failed to extract text. Please upload a text-based resume.");
        return false;
      }

      const extracted = extractFields(text);
      setFields(extracted);
      setShowStartButton(true);
      message.success("Resume parsed successfully!");
    } catch (err) {
      console.error("Parsing error:", err);
      message.error("Failed to parse resume. Please try again with another file.");
    }

    return false; // prevent auto-upload
  };

  const handleFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartQuiz = async () => {
    if (!fields.name || !fields.name.trim()) {
      message.error("Name is required to start the test.");
      return;
    }

    setLoading(true);

    try {
      // This is the point where AI service runs
      const questions = await aiService.generateQuestions();
      message.success("Quiz generated successfully!");
      
      // Pass the extracted fields + questions to the parent / quiz component
      onStartQuiz({ profile: fields, questions });
    } catch (err) {
      console.error("Error generating quiz:", err);
      message.error("Failed to start quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      {!showStartButton && (
        <Dragger
          accept=".pdf,.docx"
          beforeUpload={handleFile}
          multiple={false}
          showUploadList={false}
          style={{ padding: 20 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag resume to this area to upload</p>
          <p className="ant-upload-hint">Supports PDF or DOCX only</p>
        </Dragger>
      )}

      {showStartButton && (
        <Card title="Extracted Details" style={{ marginTop: 20 }}>
          <Input
            placeholder="Name"
            value={fields.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Email"
            value={fields.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Phone"
            value={fields.phone || ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" onClick={handleStartQuiz} disabled={loading}>
            {loading ? <Spin /> : "Start Test"}
          </Button>
        </Card>
      )}
    </div>
  );
}
