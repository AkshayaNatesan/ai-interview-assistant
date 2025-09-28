// // import React from 'react'
// // import { Tabs, Layout } from 'antd'
// // import Interviewee from './components/Interviewee'
// // import Interviewer from './components/Interviewer'

// // const { Header, Content } = Layout

// // export default function App() {
// //   return (
// //     <Layout style={{ minHeight: '100vh' }}>
// //       <Header style={{ color: 'white', fontSize: 18 }}>AI Interview Assistant — Demo</Header>
// //       <Content style={{ padding: 20 }}>
// //         <Tabs defaultActiveKey="1">
// //           <Tabs.TabPane tab="Interviewee" key="1">
// //             <Interviewee />
// //           </Tabs.TabPane>
// //           <Tabs.TabPane tab="Interviewer" key="2">
// //             <Interviewer />
// //           </Tabs.TabPane>
// //         </Tabs>
// //       </Content>
// //     </Layout>
// //   )
// // }

// import React from 'react'
// import { Tabs, Layout } from 'antd'
// import Interviewee from './components/Interviewee'
// import Interviewer from './components/Interviewer'

// const { Header, Content } = Layout

// export default function App() {
//   const items = [
//     {
//       key: '1',
//       label: 'Interviewee',
//       children: <Interviewee />
//     },
//     {
//       key: '2',
//       label: 'Interviewer',
//       children: <Interviewer />
//     }
//   ]

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Header style={{ color: 'white', fontSize: 18 }}>
//         AI Interview Assistant — Demo
//       </Header>
//       <Content style={{ padding: 20 }}>
//         <Tabs defaultActiveKey="1" items={items} />
//       </Content>
//     </Layout>
//   )
// }


import React from 'react';
import { Layout, Tabs } from 'antd';
import Interviewee from './components/Interviewee';
import Interviewer from './components/Interviewer';

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: 18 }}>
        Crisp: Your Smart Interview Companion – Assess, Learn, Excel.✨
      </Header>
      <Content style={{ padding: 20 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Interviewee" key="1">
            <Interviewee />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Interviewer" key="2">
            <Interviewer />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}
