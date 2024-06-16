const favouriteController = require("../controllers/favourites-controller");
const Router = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const favouriteRouter = Router();
module.exports = favouriteRouter;

favouriteRouter.get("/getAll", authMiddleware, favouriteController.getAllFavourites);
favouriteRouter.post("/addFavourite/:id", authMiddleware, favouriteController.addOne);
favouriteRouter.delete("/deleteFavourite/:id", authMiddleware, favouriteController.deleteOne);
