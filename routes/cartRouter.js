const Router = require("express");
const cartController = require("../controllers/cart-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const cartRouter = Router();
module.exports = cartRouter;


cartRouter.get("/getAll", authMiddleware, cartController.getAll);
cartRouter.post("/addOne/:id", authMiddleware, cartController.addOne);
cartRouter.delete("/deleteOne/:id", authMiddleware, cartController.deleteOne);
cartRouter.put("/updateProductCount", authMiddleware, cartController.updateProductCount);