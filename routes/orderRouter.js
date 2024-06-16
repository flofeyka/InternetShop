const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const ownerMiddleware = require("../middlewares/owner-middleware");
const orderController = require("../controllers/order-controller");

const orderRouter = Router({});
module.exports = orderRouter;

orderRouter.get("/getTakenOrders", authMiddleware, orderController.getTakenOrders)
orderRouter.get("/getNotVerifiedOrders", authMiddleware, ownerMiddleware, orderController.getNotVerifiedOrders);
orderRouter.post("/verifyOrder/:id", authMiddleware, ownerMiddleware, orderController.verifyOrder);
orderRouter.get("/getMyOrders", authMiddleware, orderController.getMyOrders);
orderRouter.get("/getOrders", authMiddleware, ownerMiddleware, orderController.getOrders)
orderRouter.post("/takeOrder/:id", authMiddleware, orderController.takeAnOrder);
orderRouter.post("/haveOrder", authMiddleware, orderController.Order);
orderRouter.delete("/cancelOrder/:id", authMiddleware, orderController.cancelOrder)
