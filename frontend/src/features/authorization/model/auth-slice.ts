import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser} from "shared/types";
import { ErrorType, Status } from "shared/types/status";
import { authUser, logoutUser, refreshUser, regUser } from "./auth-actions";
import { updateObject } from "../lib/updateObject";

export interface IAuthSlice{
  status: Status,
  error: ErrorType,
  user: IUser|null,
  isAuth: boolean,
  message: string,
}

type IData = Status | ErrorType | IUser | null | boolean | string

export const initialState:IAuthSlice = {
  status: "idle",
  error: null,
  user: null,
  isAuth: false,
  message: "",
}

export type TKeyAuth = keyof IAuthSlice

export type TAuthPayload = {
  [K in TKeyAuth]: IAuthSlice[K];
};


export interface ActionAuthSlice {
  key: TKeyAuth,
  data: TAuthPayload[TKeyAuth]
}

export const authSlice = createSlice({
    name: "@authSlice",
    initialState: initialState,
    reducers: {
      setAuthSlice: (state, action: PayloadAction<ActionAuthSlice>) => {
        const {key, data} = action.payload
        return updateObject<IAuthSlice, IData>(state, key, data)
      },
      clearErrorAuth: (state) => {
        state.error = null
      },
      clearStatusAuth: (state) => {
        state.status = "idle"
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(authUser.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(authUser.rejected, (state, {payload}) => {
          state.status = 'rejected';
          state.error = payload || 'Неправильный логин или пароль';
          state.message = String(payload || "Неправильный логин или пароль")
        })
        .addCase(authUser.fulfilled, (state, {payload}) => {
          localStorage.setItem("token", payload.tokens.accessToken)
          state.status = 'received';
          state.user = payload.user;
          state.isAuth = true;
        })
        .addCase(refreshUser.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(refreshUser.rejected, (state, action) => {
          state.status = 'rejected';
          console.log(action.payload || "error in resresh user")
        })
        .addCase(refreshUser.fulfilled, (state, {payload}) => {
          localStorage.setItem("token", payload.tokens.accessToken)
          state.status = 'received';
          state.user = payload.user;  
          state.isAuth = true;
          state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state,) => {
          state.isAuth = false;
          state.user = null;
        })
        .addCase(regUser.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(regUser.rejected, (state, {payload}) => {
          state.status = 'rejected';
          state.error = payload || 'Cannot load data';
          state.message = payload || 'Ошибка при регистрации';
        })
        .addCase(regUser.fulfilled, (state, {payload}) => {
          localStorage.setItem("token", payload.tokens.accessToken)
          state.isAuth = true;
          state.user = payload.user;
          state.status = 'received';
          state.error = null;
        })
    }
})

export const {clearErrorAuth, clearStatusAuth, setAuthSlice} =  authSlice.actions
