import { configureStore } from '@reduxjs/toolkit'
import { apiClient } from '../../services/rtk/apiClient'
import rootReducer from '../../store/rootReducer'

export const store = configureStore({
  reducer: {
    [apiClient.reducerPath]: apiClient.reducer,
    ...rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiClient.middleware),
})

export default store;
