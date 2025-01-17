import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
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

export default RefreshToken;
