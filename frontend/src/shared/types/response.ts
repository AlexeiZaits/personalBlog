import { IUser } from "./user";

export interface AuthResponse {
    access_token: string,
    refresh_token: string,
    user: IUser,
    login: string,
}

export interface RegResponse {
    message: string,
}