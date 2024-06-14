module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unAuthorizedError() {
        return new ApiError(401, "User is not authorized");

    }

    static invalidCaptcha() {
        return new ApiError(400, "Invalid captcha");
    }

    static notFound(_, message = "Not found") {
        return new ApiError(404, message);
    }

    static BadRequest(message = "Bad request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static invalidId(_, message = "Invalid id") {
        return new ApiError(404, message)
    }
}