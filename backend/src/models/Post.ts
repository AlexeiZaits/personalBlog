import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Post extends Model {
  public id!: number;
  public content!: string;
  public lastname!: string;
  public firstname!: string;
  public mediaUrls!: string[] | null;
  public userId!: string;
  public createdAt!: Date;
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
    lastname: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUIDV4,
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
