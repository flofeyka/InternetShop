const User = require("../models/User");
const Purchase = require("../models/Purchase");
const ApiError = require("../exceptions/api-error");
const purchaseDto = require("../dtos/purchaseDto");

module.exports = new class cartService {
    async updateProductCount(id, productId, count) {
        const user = await User.findById(id);
        const product = await user.cart.find(i => i.id === productId);
        if(!product) {
            throw ApiError.notFound(404, "The product is not found");
        }

        const cart = [...user.cart, {
            id: productId,
            count: count
        }]
        console.log(cart);

        // await User.findOneAndUpdate({
        //     _id: id,
        // }, {
        //     $set
        // });

        return count;
    }

    async getAll(userId) {
        const user = await User.findById(userId);
        const cartList = [];
        let finalPrice = 0;
        for(let i = 0; i < user.cart.length; i++) {
            const cart = await Purchase.findById(user.cart[i].id);
            const PurchaseDto = new purchaseDto(cart);
            finalPrice =+ cart.price;
            cartList.push({finalProductPrice: user.cart[i].count * PurchaseDto.price, ...PurchaseDto});
        }

        return {
            totalCount: user.cart.length,
            finalPrice,
            cartList
        }
    }

    async addOne(userId, product, count = 1) {
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product === i.id);
        if(productFound) {
            throw ApiError.BadRequest("The product is already in the cart");
        }

        const cartUpdated = await User.updateOne({_id: userId}, {
            $push: {cart: {id: product, count}}
        });
        const productAdded = await Purchase.findById(product);
        const productDto = new purchaseDto(productAdded);
        if (cartUpdated.modifiedCount === 1) {
            return productDto;
        }
    }

    async deleteOne(userId, product) {
        const user = await User.findById(userId);
        const productFound = user.cart.find(i => product === i.id);
        if(!productFound) {
            throw ApiError.BadRequest("The product is not found in the cart");
        }

        const cartDeleted = await User.updateOne({_id: userId}, {
            $pull: {cart: {id: product}}
        })

        return cartDeleted.modifiedCount === 1;
    }
}