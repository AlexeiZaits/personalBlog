import jwt from "jsonwebtoken";
import { RefreshToken } from "../models";
import { UserResponse } from "./user-service";

class TokenService {
    generateTokens(payload: UserResponse){
        if (!process.env.JWT_ACCESS_TOKEN || !process.env.JWT_REFRESH_TOKEN) {
            throw new Error("JWT_ACCESS_TOKEN || JWT_REFRESH_TOKEN is undefined");
        }
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: "15m"})
        
        return {
            accessToken,
            refreshToken
        }
    }
    
    async saveToken(userId:string, refreshToken: string){
        const tokenData = await RefreshToken.findOne({where: {userId}})
        if (tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save();
        }
        const token = await RefreshToken.create({userId: userId, refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
        return token
    }
    
    async removeToken(refreshToken: string){
        try {
            const tokenData = await RefreshToken.destroy({
                where: {
                    refreshToken: refreshToken,
                },
                limit: 1,
            });
            return tokenData;
            
        } catch (e) {
            console.log("Ошибка при удалении токена")
        }
    }

    validateAccessToken(token: string){
        try {
            if (process.env.JWT_ACCESS_TOKEN){
                const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
                return userData
            }
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token: string){
        try {
            if (process.env.JWT_REFRESH_TOKEN){
                const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
                return userData
            }
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken: string){
        try {
            const tokenData = await RefreshToken.findOne({
                where: {
                    refreshToken: refreshToken,
                },
            });
            return tokenData;
        } catch (error) {
            throw new Error("Токен не найден")
        }
    }
}

export const tokenService = new TokenService()