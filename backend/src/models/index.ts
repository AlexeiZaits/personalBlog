import User from "./User";
import Post from "./Post";
import RefreshToken from "./RefreshToken";
import sequelize from "../config/database";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

const initDB = async () => {
  await sequelize.sync({ force: false });
};

export { User, Post, RefreshToken,  initDB };
