const authService = require("../services/auth-service");

class authController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const usersData = await authService.login(email, password);
            res.cookie("refreshToken", usersData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
              });

            return res.json(usersData);
        } catch (e) {
            next(e);
        }
    }

    async register(req, res, next) {
        try {
            const {name, email, phoneNumber, password} = req.body;
            const data = await authService.register(name, email, phoneNumber, password);
            res.cookie("refreshToken", data.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
              });
            return res.json(data);
        } catch (e) {
            next(e)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const usersData = await authService.refresh(refreshToken);
            res.cookie("refreshToken", usersData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(usersData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const isDeleted = await authService.logout(refreshToken);
            res.clearCookie("refreshToken")
            return res.json(isDeleted ? "Logout is completed successfully" : "Error while logout")
        } catch (e) {
            next(e);
        }
    }

    async updatePassword(req, res, next) {
        try {
            const {oldPassword, password} = req.body;
            const isUpdated = await authService.updatePassword(req.user.id, oldPassword, password);
            return res.status(isUpdated ? 200 : 400).json(isUpdated ? {
                message: "Password is successfully changed"
            } : {
                message: "Error while updating password"
            })
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new authController();