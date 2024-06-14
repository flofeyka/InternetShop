const ApiError = require("../exceptions/api-error");

module.exports = async function(req, res, next) {
    try {
        const captchaVerified = await fetch("https://www.google.com/recaptcha/api/siteverify?" +
            `secret=6LdxNPYpAAAAAHb-JhGTlpNvXCNJeX0jzOw3-Ng6&response=${req.body.captcha}`, {
            method: "POST"
        }).then(_res => _res.json())
        console.log(captchaVerified)
        if(captchaVerified.success !== true) {
            return next(ApiError.invalidCaptcha());
        }

        next();
    } catch(e) {
        return next(ApiError.invalidCaptcha());
    }
}