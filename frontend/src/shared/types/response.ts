import { IUser } from "./user";

export interface AuthResponse {
    tokens: {
        accessToken: string,
        refreshToken: string,
    }
    user: IUser,
}

export interface RegResponse {
    message: string,
}