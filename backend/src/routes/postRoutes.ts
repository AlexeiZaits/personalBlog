import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { postController } from "../controllers/postController";
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const router = express.Router();
router.post("/", authMiddleware, upload.array('media'), postController.createPost);
router.get("/", postController.getPosts);
router.put("/:id", authMiddleware, upload.array('media'), postController.changePost);
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Маршруты для создания/удаления/редактирования/получения постов
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Создание нового поста
 *     description: Создает новый пост для авторизованного пользователя с возможностью загрузки медиа-файлов.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Мой первый пост"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "post123"
 *                 content:
 *                   type: string
 *                   example: "Мой первый пост"
 *                 mediaUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["https://cloud.yandex.ru/media/image1.png"]
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Ошибка в создании нового поста
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Posts]
 *     summary: Получение всех постов
 *     description: Возвращает список всех постов.
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: "Мой первый пост"
 *                   lastname:
 *                     type: string
 *                     example: "Иванов"
 *                   firstname:
 *                     type: string
 *                     example: "Иван"
 *                   mediaUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [
 *                       "https://storage.yandexcloud.net/personal-blog/media/user123/1737403015406_0.png",
 *                       "https://storage.yandexcloud.net/personal-blog/media/user123/1737403016601_1.mp4"
 *                     ]
 *                   userId:
 *                     type: string
 *                     example: "b00ac858-78e9-42bb-b35d-a5f53912c51c"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T19:56:57.843Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T19:56:57.844Z"
 *       500:
 *         description: Ошибка в получении всех записей
 */


/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Изменение поста
 *     description: Обновляет существующий пост авторизованного пользователя с возможностью изменения медиа-файлов.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Идентификатор поста
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Обновлённый текст поста"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Пост успешно обновлён
 *       400:
 *         description: Пост не найден
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Ошибка при изминение поста
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Удаление поста
 *     description: Удаляет существующий пост авторизованного пользователя.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Идентификатор поста
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пост успешно удалён
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пост не найден
 *       500:
 *         description: Ошибка в удаление поста
 */
