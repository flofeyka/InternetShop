const Router = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const purchaseController = require("../controllers/purchase-controller");
const ownerMiddleware = require("../middlewares/owner-middleware")
const purchaseRouter = Router();
module.exports = purchaseRouter;


purchaseRouter.put("/editProduct/:id", authMiddleware, ownerMiddleware, purchaseController.editProduct)
purchaseRouter.delete("/deleteProduct/:id", authMiddleware, ownerMiddleware, purchaseController.deleteProduct)
purchaseRouter.put("/editProductImage/:id", authMiddleware, ownerMiddleware, purchaseController.editProductImage)
purchaseRouter.get("/getMyProducts", authMiddleware, ownerMiddleware, purchaseController.getMyProducts);
purchaseRouter.post("/createProduct", authMiddleware, ownerMiddleware, purchaseController.createProduct)
purchaseRouter.get("/get", purchaseController.getAll);
purchaseRouter.get("/getHistory", authMiddleware, purchaseController.getHistory);
purchaseRouter.get("/getOneById/:id", authMiddleware, purchaseController.getOneById);
purchaseRouter.delete("/clearHistory", authMiddleware, purchaseController.clearHistory);
purchaseRouter.post("/parseProducts", authMiddleware, ownerMiddleware, purchaseController.parseProducts);
