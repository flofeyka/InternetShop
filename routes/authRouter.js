const express = require("express");
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const captchaMiddleware = require("../middlewares/captcha-middleware");
const authRouter = express.Router();
module.exports = authRouter;

authRouter.post("/login", captchaMiddleware, authController.login);
authRouter.post("/register", captchaMiddleware, authController.register);
authRouter.get("/getUsersData", authController.refreshToken);
authRouter.delete("/logout", authController.logout);
authRouter.put("/changePassword", authMiddleware, captchaMiddleware, authController.updatePassword);