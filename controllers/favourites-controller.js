const favouritesService = require("../services/favourites-service");

module.exports = new class favouritesController {
    async getAllFavourites(req, res, next) {
        try {
            const favouritesFound = await favouritesService.getAllFavourites(req.user.id);
            return res.status(favouritesFound ? 200 : 400).json(favouritesFound);
        } catch(e) {
            next(e);
        }

    }

    async addOne(req, res, next) {
        try {
            const isAdded = await favouritesService.addOne(req.user.id, req.params.id)
            return res.status(isAdded ? 200 : 400).json(isAdded);
        } catch(e) {
            next(e);
        }
    }

    async deleteOne(req, res, next) {
        try {
            const isDeleted = await favouritesService.deleteOne(req.user.id, req.params.id);
            return res.status(isDeleted ? 200 : 400).json(isDeleted);
        } catch(e) {
            next(e);
        }
    }
}