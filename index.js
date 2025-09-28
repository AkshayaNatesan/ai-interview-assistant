// import { configureStore } from '@reduxjs/toolkit'
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import { combineReducers } from 'redux'
// import candidatesReducer from './candidatesSlice'

// const rootReducer = combineReducers({
//   candidates: candidatesReducer,
// })

// const persistConfig = {
//   key: 'root',
//   storage,
// }

// export default function setupStore() {
//   const persisted = persistReducer(persistConfig, rootReducer)
//   const store = configureStore({ reducer: persisted })
//   const persistor = persistStore(store)
//   return { store, persistor }
// }


import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import candidatesReducer from './candidatesSlice';

const rootReducer = combineReducers({
  candidates: candidatesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

export default function setupStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid non-serializable warnings
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
}
