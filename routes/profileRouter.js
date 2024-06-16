const Router = require("express");
const profileController = require("../controllers/profile-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const ownerMiddleware = require("../middlewares/owner-middleware");

const profileRouter = Router();
module.exports = profileRouter;

profileRouter.post("/uploadImage", authMiddleware, profileController.uploadUsersImage);
profileRouter.delete("/deleteImage", authMiddleware, profileController.deleteUsersImage);
profileRouter.put("/updateProfileData", authMiddleware, profileController.updateUserInfo);
profileRouter.get("/getUserById/:id", authMiddleware, profileController.getUserInfoById);
profileRouter.get("/getOwners", authMiddleware, ownerMiddleware, profileController.getOwners);
profileRouter.post("/setOwner", authMiddleware, ownerMiddleware, profileController.setOwner);
profileRouter.delete("/deleteOwner/:id", authMiddleware, ownerMiddleware, profileController.deleteOwner);

