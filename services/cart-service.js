const User = require("../models/User");
const Purchase = require("../models/Purchase");
const ApiError = require("../exceptions/api-error");
const purchaseDto = require("../dtos/purchaseDto");
const userDto = require("../dtos/userDto");
const mongoose = require("mongoose");

module.exports = new class cartService {
    async updateProductCount(id, productId, count) {
        const user = await User.findById(id);
        const product = await user.cart.find(i => i.id.toString() === productId);
        if (!product) {
            throw ApiError.notFound("The product is not found");
        }

        const data = await User.updateOne({
            _id: id,
        }, {
            $set: {"cart.$[xxx].count": count}
        }, {
            arrayFilters: [
                {"xxx.id": new mongoose.Types.ObjectId(productId)}
            ]
        });

        if(data.modifiedCount === 1) {
            return await this.getAll(id);
        }

        return await this.getAll(id);

    }

    async getAll(userId) {
        const user = await User.findById(userId);
        let totalCount = 0;
        const cartList = [];
        let finalPrice = 0;
        for (let i = 0; i < user.cart.length; i++) {
            const cart = await Purchase.findById(user.cart[i].id);
            const PurchaseDto = new purchaseDto(cart);
            totalCount += user.cart[i].count;
            finalPrice += cart.price * user.cart[i].count;
            cartList.push({finalProductPrice: user.cart[i].count * PurchaseDto.price, count: user.cart[i].count, ...PurchaseDto});
        }

        return {
            totalCount,
            finalPrice,
            cartList
        }
    }

    async addOne(userId, product, count = 1) {
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product === i.id);
        if (productFound) {
            throw ApiError.BadRequest("The product is already in the cart");
        }
        const productAdded = await Purchase.findById(product);

        const cartUpdated = await User.updateOne({_id: userId}, {
            $push: {cart: {id: productAdded._id, count}}
        });
        const productDto = new purchaseDto(productAdded);
        if (cartUpdated.modifiedCount === 1) {
            return productDto;
        }
    }

    async deleteOne(userId, id) {
        const product = await Purchase.findById(id);
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product._id.toString() === i.id.toString());
        if (!productFound) {
            throw ApiError.BadRequest("The product is not found in the cart");
        }


        const cartDeleted = await User.updateOne({_id: userId}, {
            $pull: {cart: {id: product._id}}
        })

        return cartDeleted.modifiedCount === 1;
    }
}