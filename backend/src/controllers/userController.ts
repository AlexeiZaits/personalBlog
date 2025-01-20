import { userService } from "../service/user-service";
import { v4 as uuidv4 } from 'uuid';

class UserController {
    async registration (req: any, res: any, next: any){
        try {
            const {login, password, lastname, firstname} = req.body;
            console.log()
            const uniqueId = uuidv4();
            const userData = await userService.registration({login: login, password: password, lastname: lastname, firstname: firstname, id: uniqueId})
            
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
            
        } catch (error) {
            return res.status(500).json({message: "Ошибка при регистрации пользователя"})
        }
    }
    
    async login (req: any, res: any, next: any){
        try {
            const {login, password} = req.body;
            const userData = await userService.login(login, password);
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
            
        } catch (error) {
            return res.status(500).json({message: "Неправильно введён логин или пароль"})
        }
    }

    async logout (req: any, res: any, next: any){
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({message: "Успешно вышел с аккаунта"});
            
        } catch (error) {
            return res.status(500).json({message: "Неправильно введён логин или пароль"})
        }
    }

    async refresh (req: any, res: any, next: any){
        try {
            const {refreshToken} = req.cookies;
            console.log(refreshToken)
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
            
        } catch (error) {
            return res.status(500).json({message: "Неправильно введён логин или пароль"})
        }
    }
}

export const userController = new UserController()