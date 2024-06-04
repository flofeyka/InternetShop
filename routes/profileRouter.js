const Router = require("express");
const profileController = require("../controllers/profile-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const profileRouter = Router();
module.exports = profileRouter;

profileRouter.put("/updateProfileData", authMiddleware, profileController.updateUserInfo);