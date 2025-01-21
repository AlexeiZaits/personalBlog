import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const DB_PORT = parseInt(process.env.DB_PORT, 10);

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dialect: 'postgres',
});

export const connectToDatabase = async () => {
  let attempts = 0;
  const maxAttempts = 10;
  const delay = 5000;  // Задержка в 5 секунд

  while (attempts < maxAttempts) {
    try {
      // Ваши параметры подключения

      await sequelize.authenticate();
      console.log('Database connected successfully!');
      break;
    } catch (error) {
      attempts++;
      console.error('Unable to connect to the database:', error);
      if (attempts >= maxAttempts) {
        console.error('Max attempts reached. Exiting...');
        process.exit(1);  // Прекратить работу после максимума попыток
      }
      await new Promise(resolve => setTimeout(resolve, delay));  // Задержка перед новой попыткой
    }
  }
};

export default sequelize