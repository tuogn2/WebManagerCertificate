// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';
import testReducer from './slices/testSlice';

// Cấu hình persist
const persistConfig = {
  key: 'root',
  storage,
};

// Kết hợp các reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  tests: testReducer,
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt serializable check cho redux-persist
    }),
});

// Tạo persistor cho store
export const persistor = persistStore(store);
export default store;
