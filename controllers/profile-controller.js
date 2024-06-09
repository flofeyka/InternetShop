const profileService = require("../services/profile-service")

module.exports = new class profileController {
    async updateUserInfo(req, res, next) {
        try {
            const {name, phoneNumber, email} = req.body;
            const updatedUserInfo = await profileService.updateUserInfo(req.user.id, name, phoneNumber, email, req.files?.image);
            return res.status(200).json(updatedUserInfo)
        } catch (e) {
            next(e)
        }
    }

    async getUserInfoById(req, res, next) {
        try {
            const profileData = await profileService.getUserInfoById(req.params.id);
            return res.status(200).json(profileData);
        } catch (e) {
            next(e);
        }
    }
}