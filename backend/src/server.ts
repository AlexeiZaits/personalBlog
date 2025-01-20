import express from "express";
import dotenv from "dotenv";
import { initDB } from "./models";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import cors from 'cors';
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();

app.use(cookieParser())
app.use(cors({
  //разрешить всем
  origin: function (origin, callback) {
    callback(null, true);
  },
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
