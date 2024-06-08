const cartService = require("../services/cart-service");

module.exports = new class cartController {
    async getAll(req, res, next) {
        try {
            const cart = await cartService.getAll(req.user.id);
            return res.status(200).json(cart);
        } catch(e) {
            next(e);
        }
    }

    async addOne(req, res, next) {
        try {
            const added = await cartService.addOne(req.user.id, req.params.id);
            return res.status(added ? 200 : 400).json(added);
        } catch(e) {
            next(e);
        }
    }

    async deleteOne(req, res, next) {
        try {
           const deleted = await cartService.deleteOne(req.user.id, req.params.id);
           return res.status(deleted ? 200 : 400).json(deleted);
        } catch(e) {
            next(e);
        }
    }
}