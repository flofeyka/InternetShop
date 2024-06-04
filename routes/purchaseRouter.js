const Router = require("express");

const purchaseRouter = Router();
module.exports = purchaseRouter;

purchaseRouter.get("/getAll", (req, res) => console.log("debil"))