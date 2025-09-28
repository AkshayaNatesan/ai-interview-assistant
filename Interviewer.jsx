// // // import React, { useMemo, useState } from 'react'
// // // import { useSelector } from 'react-redux'
// // // import { Table, Card, Input, Space, Button } from 'antd'
// // // import CandidateDetail from './CandidateDetail'

// // // export default function Interviewer() {
// // //   const candidates = useSelector(s => s.candidates)
// // //   const [query, setQuery] = useState('')
// // //   const [selected, setSelected] = useState(null)

// // //   const data = useMemo(() => (candidates.allIds || []).map(id => {
// // //     const c = candidates.byId[id]
// // //     return { key: id, id, name: (c.profile && c.profile.name) || 'Unknown', email: c.profile?.email || '', phone: c.profile?.phone || '', score: c.final?.score || 0, status: c.session?.status || 'n/a' }
// // //   }).filter(r => !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase())), [candidates, query])

// // //   const columns = [
// // //     { title: 'Name', dataIndex: 'name', key: 'name' },
// // //     { title: 'Email', dataIndex: 'email', key: 'email' },
// // //     { title: 'Phone', dataIndex: 'phone', key: 'phone' },
// // //     { title: 'Score', dataIndex: 'score', key: 'score', sorter: (a,b)=> b.score - a.score },
// // //     { title: 'Status', dataIndex: 'status', key: 'status' },
// // //     { title: 'Actions', key: 'actions', render: (_, row) => <Button onClick={()=> setSelected(row.id)}>View</Button> }
// // //   ]

// // //   return (
// // //     <Card>
// // //       <Space style={{ marginBottom: 12, width: '100%' }} direction="vertical">
// // //         <Input.Search placeholder="Search by name or email" enterButton onSearch={val=>setQuery(val)} />
// // //         <Table dataSource={data} columns={columns} />
// // //         {selected && <CandidateDetail candidateId={selected} />}
// // //       </Space>
// // //     </Card>
// // //   )
// // // }


// // import React, { useState, useMemo } from 'react';
// // import { useSelector } from 'react-redux';
// // import { Table, Card, Input, Space } from 'antd';

// // export default function Interviewer() {
// //   const candidates = useSelector(s => s.candidates);
// //   const [query,setQuery] = useState('');

// //   const data = useMemo(()=> (candidates.allIds||[]).map(id=>{
// //     const c = candidates.byId[id];
// //     return {
// //       key:id,
// //       id,
// //       name:c.profile?.name || 'Unknown',
// //       email:c.profile?.email || '',
// //       phone:c.profile?.phone || '',
// //       score:c.final?.score || 0,
// //       status:c.session?.status || 'Pending'
// //     };
// //   }).filter(r=>!query || r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase())), [candidates, query]);

// //   const columns = [
// //     {title:'Name', dataIndex:'name', key:'name'},
// //     {title:'Email', dataIndex:'email', key:'email'},
// //     {title:'Phone', dataIndex:'phone', key:'phone'},
// //     {title:'Score', dataIndex:'score', key:'score', sorter:(a,b)=>b.score-a.score},
// //     {title:'Status', dataIndex:'status', key:'status'}
// //   ];

// //   return(
// //     <Card>
// //       <Space style={{marginBottom:12, width:'100%'}} direction="vertical">
// //         <Input.Search placeholder="Search by name or email" enterButton onSearch={val=>setQuery(val)} />
// //         <Table dataSource={data} columns={columns} />
// //       </Space>
// //     </Card>
// //   )
// // }


// import React, { useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Table, Card, Input, Space } from 'antd';

// export default function Interviewer() {
//   const candidates = useSelector(s => s.candidates);
//   const [query,setQuery] = useState('');

//   const data = useMemo(()=> (candidates.allIds || []).map(id=>{
//     const c = candidates.byId[id];
//     return {
//       key:id,
//       id,
//       name: c.profile?.name || 'Unknown',
//       email: c.profile?.email || '',
//       phone: c.profile?.phone || '',
//       score: c.final?.score || 0,
//       status: c.session?.status || 'n/a'
//     }
//   }).filter(r => !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase())),
//   [candidates, query]);

//   const columns = [
//     { title:'Name', dataIndex:'name', key:'name' },
//     { title:'Email', dataIndex:'email', key:'email' },
//     { title:'Phone', dataIndex:'phone', key:'phone' },
//     { title:'Score', dataIndex:'score', key:'score', sorter:(a,b)=>b.score - a.score },
//     { title:'Status', dataIndex:'status', key:'status' }
//   ];

//   return (
//     <Card>
//       <Space style={{marginBottom:12,width:'100%'}} direction="vertical">
//         <Input.Search placeholder="Search by name or email" enterButton onSearch={val=>setQuery(val)} />
//         <Table dataSource={data} columns={columns} />
//       </Space>
//     </Card>
//   )
// }

import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Card, Input, Space, Button, Collapse, Typography, Tag, Popconfirm, message } from 'antd';
import { deleteCandidate } from '../store/candidatesSlice'; // make sure this exists

const { Panel } = Collapse;
const { Paragraph, Text } = Typography;

export default function Interviewer() {
  const dispatch = useDispatch();
  const candidates = useSelector(s => s.candidates);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const data = useMemo(() => (candidates.allIds || []).map(id => {
    const c = candidates.byId[id];
    return {
      key: id,
      id,
      name: c.profile?.name || 'Unknown',
      email: c.profile?.email || '',
      phone: c.profile?.phone || '',
      score: c.final?.score || 0,
      status: c.session?.status || 'n/a',
      answers: c.answers || []
    };
  }).filter(r => !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase())),
  [candidates, query]);

  const handleDelete = (id) => {
    dispatch(deleteCandidate(id));
    message.success('Candidate deleted successfully.');
    if(expandedId === id) setExpandedId(null);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: text => <Text strong>{text}</Text> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Score', dataIndex: 'score', key: 'score', sorter: (a, b) => b.score - a.score, render: val => <Tag color={val >= 4 ? 'green' : val >= 2 ? 'orange' : 'red'}>{val}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: val => <Tag color={val==='completed'?'green':'blue'}>{val}</Tag> },
    { title: 'Actions', key: 'actions', render: (_, row) => (
      <Space>
        <Button type="link" onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}>
          {expandedId === row.id ? 'Hide Details' : 'View Details'}
        </Button>
        <Popconfirm
          title="Are you sure to delete this candidate?"
          onConfirm={() => handleDelete(row.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      </Space>
    )}
  ];

  return (
    <Card style={{ borderRadius: 15, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
      <Space style={{ marginBottom: 12, width: '100%' }} direction="vertical">
        <Input.Search placeholder="Search by name or email" enterButton onSearch={val => setQuery(val)} style={{ maxWidth: 400 }} />
        <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowClassName={(record) => record.id === expandedId ? 'ant-table-row-selected' : ''} />

        {expandedId && (() => {
          const candidate = data.find(c => c.id === expandedId);
          if(!candidate) return null;
          return (
            <Card style={{ marginTop: 20, backgroundColor: '#f7f7f7', borderRadius: 10 }}>
              <Typography.Title level={4}>Detailed Quiz Info - {candidate.name}</Typography.Title>
              <Collapse defaultActiveKey={candidate.answers.map((_,i)=>i.toString())}>
                {candidate.answers.map((a, index) => (
                  <Panel header={`Q${index+1}: ${a.text}`} key={index.toString()}>
                    <Paragraph>
                      <Text strong>Options:</Text>
                      <ul>
                        {a.options.map((opt, idx) => (
                          <li key={idx}>
                            {idx === a.answer && <Tag color="green">Correct</Tag>}
                            {idx === a.selected && <Tag color="blue">Selected</Tag>}
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <Text>Result: </Text>
                      {a.selected === a.answer ? <Tag color="green">Correct</Tag> : <Tag color="red">Wrong</Tag>}
                    </Paragraph>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          );
        })()}
      </Space>
    </Card>
  );
}
