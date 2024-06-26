const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const ownerMiddleware = require("../middlewares/owner-middleware");
const orderController = require("../controllers/order-controller");

const orderRouter = Router({});
module.exports = orderRouter;

orderRouter.post("/verifyOrder/:id", authMiddleware, ownerMiddleware, orderController.verifyOrder);
orderRouter.post("/takeOrder/:id", authMiddleware, orderController.takeAnOrder);
orderRouter.post("/haveOrder", authMiddleware, orderController.Order);
orderRouter.delete("/cancelOrder/:id", authMiddleware, orderController.cancelOrder);
orderRouter.get("/getOrders", authMiddleware, orderController.getOrders);
