import express from "express";
import jwt from "jsonwebtoken";
import { RefreshToken, User } from "../models";

const router = express.Router();

export const generateAccessToken = (userId: number): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = async (userId: number): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  await RefreshToken.create({
    token,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};

router.post("/register", async (req, res) => {
  console.log(req.body)
  try {
    const { username, password } = req.body;

    const user = await User.create({ username, password });
    console.log(user)
    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({ message: "User registered", accessToken, refreshToken });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/logout", async (req: any, res: any) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
      }
      
      await RefreshToken.destroy({ where: { token: refreshToken } });
  
      res.json({ message: "User logged out" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
});

export default router;
