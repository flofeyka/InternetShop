const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];
        const userData = tokenService.validateAccessToken(accessToken);

        if (!authHeader || !accessToken || !userData) {
            return next(ApiError.unAuthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.unAuthorizedError());
    }
}