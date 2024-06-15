const express = require("express");
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const captchaMiddleware = require("../middlewares/captcha-middleware");
const { body } = require("express-validator");
const authRouter = express.Router();
module.exports = authRouter;

authRouter.post("/login", body("email").trim().notEmpty().isEmail().withMessage("Email is invalid"), body("password").trim().notEmpty().isLength({min: 8}), captchaMiddleware, authController.login);
authRouter.post("/register",
     body("email").trim().notEmpty().isEmail().withMessage("Email is invalid"), 
     body("password").trim().notEmpty().isLength({min: 8}).withMessage("Password should have more 8 symbols"),
     body("phoneNumber").trim().notEmpty().isLength({min: 11, max: 11}).isMobilePhone().withMessage("Mobile phone is invalid"), 
     captchaMiddleware, authController.register);
authRouter.get("/getUsersData", authController.refreshToken);
authRouter.delete("/logout", authController.logout);
authRouter.put("/changePassword", 
    body("password").trim().notEmpty().isLength({min: 8}).withMessage("Password should have more 8 symbols"), 
    authMiddleware, captchaMiddleware, authController.updatePassword);