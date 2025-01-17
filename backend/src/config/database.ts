import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB!,
  process.env.POSTGRES_USER!,
  process.env.POSTGRES_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize