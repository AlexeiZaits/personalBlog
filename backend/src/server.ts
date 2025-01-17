import express from "express";
import dotenv from "dotenv";
import { initDB } from "./models";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

const startServer = async () => {
  await initDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
