import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './features/auth/authSlice'
import projectReducer from './features/project/projectSlice'

const rootPersistConfig = {
  key: 'root', // The key for the root reducer
  storage: storage, // Use local storage for persisting user data
  whitelist: ['user', 'project'] // user data can store in redux when press f5
}

// Combine all reducers
const reducers = combineReducers({
  user: userReducer,
  project: projectReducer
})

// Process persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store