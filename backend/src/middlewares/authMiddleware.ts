import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenService } from "../service/token-service";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const authMiddleware = (req:any, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
  
    const token = authHeader.split(" ")[1];
  
  
    const userData = tokenService.validateAccessToken(token)
    if (!userData){
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }
    req.user = userData
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
