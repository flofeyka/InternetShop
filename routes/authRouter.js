const express = require("express");
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const authRouter = express.Router();
module.exports = authRouter;

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/getUsersData", authController.refreshToken);
authRouter.delete("/logout", authController.logout);
authRouter.put("/changePassword", authMiddleware, authController.updatePassword);
