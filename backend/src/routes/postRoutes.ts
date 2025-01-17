import express from "express";
import { Post } from "../models";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Создать новую запись
router.post("/", authMiddleware, async (req: any, res: any) => {
  try {
    const { content, mediaUrl } = req.body;
    const userId = req.user.id; // ID из JWT токена

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const post = await Post.create({ content, mediaUrl, userId });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Ошибка в создании новой записи" });
  }
});

// Получить все записи
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Ошибка в получении всех записей" });
  }
});

// Редактировать запись
router.put("/:id", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { content, mediaUrl } = req.body;
    const userId = req.user.id; // ID из JWT токена

    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    post.content = content || post.content;
    post.mediaUrl = mediaUrl || post.mediaUrl;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Ошибка в редактировании записи" });
  }
});

// Удалить запись
router.delete("/:id", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ID из JWT токена

    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }
    
    await post.destroy();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка в удалении поста" });
  }
});

export default router;
