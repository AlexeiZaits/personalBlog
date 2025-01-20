import { User } from "../models";
import { UserAttributes } from "../models/User";
import bcryptjs from "bcryptjs";
import { tokenService } from "./token-service";
import { JwtPayload } from "jsonwebtoken";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  login: string;
  firstname: string;
  lastname: string;
}

class UserService {
  async registration(data: UserAttributes): Promise<{
    tokens: Tokens;
    user: UserResponse;
  }> {
    const { login, password } = data;

    const user = await User.findOne({ where: { login } });
    if (user) {
      throw new Error(`Пользователь с логином ${login} уже существует`);
    }

    const newUser = await User.create({ ...data, password });

    const tokens = tokenService.generateTokens({
      id: newUser.id,
      login: newUser.login,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
    });

    await tokenService.saveToken(newUser.id, tokens.refreshToken);
    
    return {
      tokens,
      user: {
        id: newUser.id,
        login: newUser.login,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
      },
    };
  }

  
  async login(
    login: string,
    password: string
  ): Promise<{
    tokens: Tokens;
    user: UserResponse;
  }> {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    
    const isPassEquals = await bcryptjs.compare(password, user.password);
    if (!isPassEquals) {
      throw new Error("Неверный пароль");
    }

    const tokens = tokenService.generateTokens({
      id: user.id,
      login: user.login,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      tokens,
      user: {
        id: user.id,
        login: user.login,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string): Promise<{
    tokens: Tokens;
    user: UserResponse;
  }> {
    if (!refreshToken) {
      throw new Error("Пользователь не авторизован");
    }
    
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenDb = await tokenService.findToken(refreshToken);
    
    if (!userData || !tokenDb) {
      throw new Error("Пользователь не авторизован");
    }

    const user = await User.findOne({ where: { id: (userData as JwtPayload).id } });
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const tokens = tokenService.generateTokens({
      id: user.id,
      login: user.login,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      tokens,
      user: {
        id: user.id,
        login: user.login,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    };
  }
}

export const userService = new UserService();
