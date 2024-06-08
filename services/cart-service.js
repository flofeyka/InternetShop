const User = require("../models/User");
const Purchase = require("../models/Purchase");
const ApiError = require("../exceptions/api-error");
const purchaseDto = require("../dtos/purchaseDto")
module.exports = new class cartService {
    async getAll(userId) {
        const user = await User.findById(userId);
        const cartList = [];

        for(let i = 0; i < user.cart.length; i++) {
            const cart = await Purchase.findById(user.cart[i]);
            const PurchaseDto = new purchaseDto(cart);
            cartList.push(PurchaseDto);
        }

        return cartList;
    }

    async addOne(userId, product) {
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product === i);
        if(productFound) {
            throw ApiError.BadRequest("The product is already in the cart");
        }

        const cartUpdated = await User.updateOne({_id: userId}, {
            $push: {cart: product}
        })

        return cartUpdated.modifiedCount === 1;
    }

    async deleteOne(userId, product) {
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product === i);
        if(!productFound) {
            throw ApiError.BadRequest("The product is not found in the cart");
        }

        const cartDeleted = await User.updateOne({_id: userId}, {
            $pull: {cart: product}
        })

        return cartDeleted.modifiedCount === 1;
    }
}