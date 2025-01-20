import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { postController } from "../controllers/postController";
import multer from 'multer';

// Настройка хранилища
const storage = multer.memoryStorage(); // Хранит файлы в памяти как Buffer
const upload = multer({ storage });     // Конфигурация Multer

const router = express.Router();

// Создать новую запись
router.post("/", authMiddleware, upload.array('media'), postController.createPost);

// Получить все записи
router.get("/", postController.getPosts);

// Редактировать запись
router.put("/:id", authMiddleware, upload.array('media'), postController.changePost);

// Удалить запись
router.delete("/:id", authMiddleware, postController.deletePost);


export default router;
