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
        for(let i = 0; i < user.favourites.length; i++) {
            const favouriteItem = await Purchase.findById(user.favourites[i]);
            const purchaseDto = new PurchaseDto(favouriteItem);
            favouritesArray.push(purchaseDto);
        }
        return favouritesArray;
    }

    async addOne(userId, id) {
        const user = await User.findById(userId);
        const favoritesFound = user.favourites.find(i => i.id === id);
        if(favoritesFound) {
            throw ApiError.BadRequest("This product is already added");
        }
        const addFavourite = await User.updateOne({_id: userId}, {
            $push: {favourites: id}
        });

        return addFavourite.modifiedCount === 1;
    }

    async deleteOne(userId, id) {
        const user = await User.findById(userId);
        const favoritesFound = user.favourites.find(i => i === id);
        if(!favoritesFound) {
            throw ApiError.BadRequest("The product is not found in favourites list");
        }
        const deleteFavourite = await User.updateOne({_id: userId}, {
            $pull: {favourites: id}
        });

        return deleteFavourite.modifiedCount === 1;
    }
}