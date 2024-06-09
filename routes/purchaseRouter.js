const Router = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const purchaseController = require("../controllers/purchase-controller");

const purchaseRouter = Router();
module.exports = purchaseRouter;

purchaseRouter.get("/get", purchaseController.getAll);
purchaseRouter.get("/getHistory", authMiddleware, purchaseController.getHistory);
purchaseRouter.post("/haveOrder", authMiddleware, purchaseController.Order);
purchaseRouter.get("/getOneById/:id", authMiddleware, purchaseController.getOneById);
purchaseRouter.delete("/clearHistory", authMiddleware, purchaseController.clearHistory);