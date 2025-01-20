import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse, Extra, IUserForm } from "shared/types";
import { AxiosError } from "axios";

export const authUser = createAsyncThunk<
AuthResponse,
IUserForm,
{
  extra: Extra,
  rejectValue: string,
}
>
(
    '@@authSlice/login',
    async (user,
    { extra: {api, client}, rejectWithValue,
    }) => {
      try {
        const data = await client.private.post(api.authUser, user);
        console.log(data.data)
        return data.data
      } catch (error) {
        if (error instanceof Error)
          return rejectWithValue(error.message);
        return rejectWithValue('Unknown error');
      }
    },
);


export const logoutUser = createAsyncThunk<
undefined,
undefined,
{
  extra: Extra,
  rejectValue: string,
}
>(
    '@@authSlice/logout',
    async (_, {
        extra: {api, client},
        rejectWithValue,
    }) => {
        try {
          localStorage.removeItem("token")
          document.cookie = "";
          client.private.post(api.logout);
        } catch (error) {
        if (error instanceof Error)
            return rejectWithValue(error.message);
        return rejectWithValue('Unknown error');
        }
    },
);


export const refreshUser = createAsyncThunk<
AuthResponse,
undefined,
{
  extra: Extra,
  rejectValue: string,
}
>
(
    '@@authSlice/refresh',
    async (_,
    { extra: {api, client}, rejectWithValue,
    }) => {
      try {
        const data = await client.private.get(api.resresh);
        console.log(data)
        return data.data
      } catch (error) {
        if (error instanceof Error)
          return rejectWithValue(error.message);
        return rejectWithValue('Unknown error');
      }
    },
);

export const regUser = createAsyncThunk<
AuthResponse,
IUserForm,
{
  extra: Extra,
  rejectValue: string,
}
>
(
    '@@authSlice/register',
    async (user,
    { extra: {api, client}, rejectWithValue,
    }) => {
      try {
        const data = await client.private.post(api.regUser, user);
        return data.data
      } catch (error) {
        if (error instanceof AxiosError){
          return rejectWithValue(error.response?.data.detail);
        }
        return rejectWithValue('Unknown error');
      }
    },
);
