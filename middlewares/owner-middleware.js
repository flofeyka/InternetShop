const ApiError = require("../exceptions/api-error");

module.exports = function(req, res, next) {
    try {
        if(!req.user.isOwner) {
            next(ApiError.BadRequest("You are not the employee this company"));
        }

        next();
    } catch(e) {
        next(e);
    }
}