const purchaseService = require("../services/purchase-service");

module.exports = new class purchaseController {
    async getAll(req, res, next) {
        try {
            const {search, sort, page, pageSize} = req.query;
            const purchases = await purchaseService.getAll(sort, search, Number(page), Number(pageSize));
            return res.json(purchases);
        } catch (e) {
            next(e);
        }
    }

    async getHistory(req, res, next) {
        try {
            const purchases = await purchaseService.getHistory(req.user.id);
            return res.json(purchases);
        } catch (e) {
            next(e);
        }
    }

    async Order(req, res, next) {
        try {
            const {id, orderCount, address, deadline} = req.body;
            const newOrder = await purchaseService.HaveOrder(req.user.id, id, orderCount, address, deadline);
            return res.json(newOrder);
        } catch (e) {
            next(e);
        }
    }

    async takeAnOrder(req, res, next) {
        try {
            const isTakenOrder = await purchaseService.takeAnOrder(req.user.id, req.params.id);
            return res.status(isTakenOrder ? 200 : 500).json(200 && "The order is successfully taken");
        } catch(e) {
            next(e);
        }
    }

    async cancelOrder(req, res, next) {
        try {
           const isOrderCanceled = await purchaseService.cancelOrder(req.user.id, req.params.id);
           return res.status(isOrderCanceled ? 200 : 500).json(isOrderCanceled && "The order is successfully cancelled");
        } catch(e) {
            next(e);
        }
    }

    async getOneById(req, res, next) {
        try {
            const purchase = await purchaseService.getPurchaseById(req.user.id, req.params.id);
            return res.json(purchase);
        } catch (e) {
            next(e);
        }
    }

    async clearHistory(req, res, next) {
        try {
            const isDeletedHistory = await purchaseService.clearHistory(req.user.id);
            return res.json(isDeletedHistory);
        } catch(e) {
            next(e);
        }
    }

}