import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import cors from 'cors';
import cookieParser from "cookie-parser"
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swaggerOption'; // Импортируйте ваш конфиг
import swaggerUi from 'swagger-ui-express';
import { connectToDatabase } from "./config/database";

dotenv.config();

const app = express();

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(cookieParser())
app.use(cors({
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
  await connectToDatabase();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();
