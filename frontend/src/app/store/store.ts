import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import * as API from "../../config";
import $client from 'shared/api';
import { Axios } from 'axios';
import { authSlice } from 'features/authorization/model/auth-slice';

export const store = configureStore({
  reducer: {
    authorization: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          client: {public: new Axios(), private: $client},
          api: API,
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch: () => AppDispatch = useDispatch;
