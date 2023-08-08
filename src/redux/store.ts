import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import bitcoinReducer from './bitcoinSlice';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['bitcoin'],
};

const persistedReducer = persistReducer(persistConfig, bitcoinReducer);

const store = configureStore({
  reducer: {
    bitcoin: persistedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
