const jwt = require("jsonwebtoken");
const Token = require("../models/Token")

module.exports = new class tokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
            expiresIn: "24h"
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
            expiresIn: "30d"
        })

        return { accessToken, refreshToken };
    }

    async findToken(refreshToken) {
        return Token.findOne({ refreshToken });
    }

    validateAccessToken(accessToken) {
        return jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
    }

    validateRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    }

    async saveToken(id, refreshToken) {
        const tokenData = await Token.findOne({ user: id });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return await Token.create({
            user: id,
            refreshToken: refreshToken
        });
    }

    removeToken(refreshToken) {
        return Token.deleteOne({ refreshToken });
    }
}