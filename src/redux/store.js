import {configureStore} from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
// file import:
import themeSlice from './themeSlice';
import authSlice from './authSlice';
import favSlice from './favSlice';
import CartSlice from './CartSlice';
import TitleSlice from './TitleSlice';
import AddressSlice from './AddressSlice';
import SettingSlice from './SettingSlice';
import SummerySlice from './SummerySlice';
import notificationSlice from './NotificationSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'cart', 'address', 'auth', 'fav', 'setting'],
  // A white list is a which slice only update to async storage.
};

const reducer = combineReducers({
  theme: themeSlice,
  auth: authSlice,
  fav: favSlice,
  cart: CartSlice,
  title: TitleSlice,
  address: AddressSlice,
  setting: SettingSlice,
  summary: SummerySlice,
  notification: notificationSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      //  {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});
