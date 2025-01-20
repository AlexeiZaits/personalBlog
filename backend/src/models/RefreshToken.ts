import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class RefreshToken extends Model {
  public id!: number; // Добавлено поле `id` как первичный ключ
  public userId!: string; // Внешний ключ для связи с User
  public refreshToken!: string;
  public expiresAt!: Date;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
  }
);

// Устанавливаем связь
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });

export default RefreshToken;
