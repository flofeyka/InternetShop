const authService = require("../services/auth-service");

class authController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const usersData = await authService.login(email, password);
            res.cookie("refreshToken", usersData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.json(usersData);
        } catch(e) {
            next(e);
        }
    }

    async register(req, res, next) {
        try {
            const {name, email, password} = req.body;
            const data = await authService.register(name, email, password);
            res.cookie("refreshToken", data.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.json(data);
        } catch(e) {
            next(e)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const usersData = await authService.refresh(refreshToken);
            res.cookie("refreshToken", usersData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
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
        } catch(e) {
            next(e);
        }
    }
}

module.exports = new authController();