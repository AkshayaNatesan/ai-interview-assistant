// // // import { createSlice } from '@reduxjs/toolkit'
// // // import { v4 as uuidv4 } from 'uuid'

// // // const initialState = {
// // //   byId: {},
// // //   allIds: []
// // // }

// // // const slice = createSlice({
// // //   name: 'candidates',
// // //   initialState,
// // //   reducers: {
// // //     // createCandidate: payload may include an `id` to allow immediate selection
// // //     createCandidate(state, action) {
// // //       const id = action.payload.id || uuidv4()
// // //       const now = Date.now()
// // //       state.byId[id] = {
// // //         id,
// // //         createdAt: now,
// // //         updatedAt: now,
// // //         profile: action.payload.profile || {},
// // //         session: action.payload.session || { status: 'needs-info', currentQuestion: 0, answers: [], remainingSeconds: null, questions: [] },
// // //         final: null
// // //       }
// // //       // put newest first
// // //       state.allIds = [id, ...state.allIds.filter(i=>i!==id)]
// // //     },
// // //     updateProfile(state, action) {
// // //       const { id, profile } = action.payload
// // //       if (!state.byId[id]) return
// // //       state.byId[id].profile = { ...state.byId[id].profile, ...profile }
// // //       state.byId[id].updatedAt = Date.now()
// // //     },
// // //     updateSession(state, action) {
// // //       const { id, session } = action.payload
// // //       if (!state.byId[id]) return
// // //       state.byId[id].session = { ...state.byId[id].session, ...session }
// // //       state.byId[id].updatedAt = Date.now()
// // //     },
// // //     saveAnswer(state, action) {
// // //       const { id, answer } = action.payload
// // //       if (!state.byId[id]) return
// // //       state.byId[id].session.answers.push(answer)
// // //       state.byId[id].updatedAt = Date.now()
// // //     },
// // //     finalizeCandidate(state, action) {
// // //       const { id, final } = action.payload
// // //       if (!state.byId[id]) return
// // //       state.byId[id].final = final
// // //       state.byId[id].session.status = 'done'
// // //       state.byId[id].updatedAt = Date.now()
// // //     },
// // //     removeCandidate(state, action) {
// // //       const { id } = action.payload
// // //       delete state.byId[id]
// // //       state.allIds = state.allIds.filter(i => i !== id)
// // //     }
// // //   }
// // // })

// // // export const { createCandidate, updateProfile, updateSession, saveAnswer, finalizeCandidate, removeCandidate } = slice.actions
// // // export default slice.reducer


// // import { createSlice } from '@reduxjs/toolkit';

// // const candidatesSlice = createSlice({
// //   name: 'candidates',
// //   initialState: { byId: {}, allIds: [] },
// //   reducers: {
// //     addCandidate: (state, action) => {
// //       const { id, profile } = action.payload;
// //       if (!state.byId[id]) {
// //         state.byId[id] = { profile, session: { answers: [], status: 'in-progress' }, final: {} };
// //         state.allIds.push(id);
// //       }
// //     },
// //     updateAnswer: (state, action) => {
// //       const { id, answer } = action.payload;
// //       if (state.byId[id]) {
// //         state.byId[id].session.answers.push(answer);
// //       }
// //     },
// //     finishCandidate: (state, action) => {
// //       const { id, score } = action.payload;
// //       if (state.byId[id]) {
// //         state.byId[id].final.score = score;
// //         state.byId[id].session.status = 'completed';
// //       }
// //     },
// //   }
// // });

// // export const { addCandidate, updateAnswer, finishCandidate } = candidatesSlice.actions;
// // export default candidatesSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   byId: {},
//   allIds: []
// };

// const candidatesSlice = createSlice({
//   name: 'candidates',
//   initialState,
//   reducers: {
//     addCandidate: (state, action) => {
//       const { id, profile } = action.payload;
//       if (!state.byId[id]) {
//         state.byId[id] = { profile, session: {}, final: {} };
//         state.allIds.push(id);
//       }
//     },
//     updateAnswer: (state, action) => {
//       const { id, answer } = action.payload;
//       if (!state.byId[id].session.answers) state.byId[id].session.answers = [];
//       state.byId[id].session.answers.push(answer);
//       state.byId[id].session.status = 'in-progress';
//     },
//     finishCandidate: (state, action) => {
//       const { id, score } = action.payload;
//       state.byId[id].final = { score };
//       state.byId[id].session.status = 'completed';
//     }
//   }
// });

// export const { addCandidate, updateAnswer, finishCandidate } = candidatesSlice.actions;
// export default candidatesSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allIds: [],
  byId: {}
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      const { id, profile } = action.payload;
      if (!state.allIds.includes(id)) state.allIds.push(id);
      state.byId[id] = { profile, answers: [], final: {}, session: { status: "pending" } };
    },
    updateAnswer: (state, action) => {
      const { id, answer } = action.payload;
      if (state.byId[id]) state.byId[id].answers.push(answer);
    },
    finishCandidate: (state, action) => {
      const { id, score } = action.payload;
      if (state.byId[id]) {
        state.byId[id].final.score = score;
        state.byId[id].session.status = "completed";
      }
    },
    deleteCandidate: (state, action) => {
      const id = action.payload;
      state.allIds = state.allIds.filter(cId => cId !== id);
      delete state.byId[id];
    }
  }
});

export const { addCandidate, updateAnswer, finishCandidate, deleteCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;
