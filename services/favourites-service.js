const User = require("../models/User");
const ApiError = require("../exceptions/api-error")
const Purchase = require("../models/Purchase");
const PurchaseDto = require("../dtos/purchaseDto");
module.exports = new class favouritesService {
    async getAllFavourites(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.unAuthorizedError();
        }
        let favouritesArray = [];
        for (let i = 0; i < user.favourites.length; i++) {
            const favouriteItem = await Purchase.findById(user.favourites[i]);
            const purchaseDto = new PurchaseDto(favouriteItem);
            favouritesArray.push(purchaseDto);
        }
        return favouritesArray;
    }

    async addOne(userId, id) {
        const user = await User.findById(userId);
        const favoritesFound = user.favourites.find(i => i === id);
        if (favoritesFound) {
            throw ApiError.BadRequest("This product is already added");
        }
        const product = await Purchase.findById(id);
        const favouriteAdded = await User.updateOne({ _id: userId }, {
            $push: { favourites: product._id }
        });
        if (favouriteAdded.modifiedCount === 1) {
            return new PurchaseDto(product)
        }
    }


    async deleteOne(userId, id) {
        const user = await User.findById(userId);
        const product = await Purchase.findById(id);
        if(!product) {
            throw ApiError.BadRequest("There is not this product")
        }
        const favoritesFound = user.favourites.find(i => i === product.id);
        if (!favoritesFound) {
            throw ApiError.BadRequest("The product is not found in favourites list");
        }

        const deleteFavourite = await User.updateOne({ _id: userId }, {
            $pull: { favourites: product._id }
        });

        return deleteFavourite.modifiedCount === 1;
    }
}