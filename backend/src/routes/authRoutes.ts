import express from "express";
import { userService } from "../service/user-service";
import { userController } from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh)

export default router;
