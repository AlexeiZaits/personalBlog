import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Post extends Model {
  public id!: number;
  public content!: string;
  public mediaUrl!: string | null; // URL для хранения медиа (картинок/видео)
  public userId!: number; // ID автора записи
  public createdAt!: Date; // Дата создания записи
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Post",
  }
);

export default Post;
