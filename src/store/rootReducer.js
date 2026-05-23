import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import { baseApi } from './api/baseApi';

const rootReducer = combineReducers({
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;