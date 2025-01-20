import express from "express";
import { userService } from "../service/user-service";
import { userController } from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh)

export default router;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Маршруты для аутентификации и управления сессиями
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Регистрация нового пользователя
 *     description: Создает нового пользователя с заданными данными.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully registered"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Вход пользователя в систему
 *     description: Выполняет вход пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully logged in"
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "access_token_here"
 *                     refreshToken:
 *                       type: string
 *                       example: "refresh_token_here"
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Выход пользователя
 *     description: Завершается сессия пользователя.
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully logged out"
 */

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     tags: [Authentication]
 *     summary: Обновление токенов
 *     description: Обновляет токены пользователя.
 *     responses:
 *       200:
 *         description: Успешное обновление токенов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tokens refreshed successfully"
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "new_access_token_here"
 *                     refreshToken:
 *                       type: string
 *                       example: "new_refresh_token_here"
 */
