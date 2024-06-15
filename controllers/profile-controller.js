const profileService = require("../services/profile-service")

module.exports = new class profileController {
    async updateUserInfo(req, res, next) {
        try {
            const {name, phoneNumber, email, gender} = req.body;
            const updatedUserInfo = await profileService.updateUserInfo(req.user.id, name, phoneNumber, email, req.files.file, gender);
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

    async getOwners(req, res, next) {
        try {
            const owners = await profileService.getOwners();
            return res.status(200).json(owners);
        } catch(e) {
            next(e);
        }
    }

    async setOwner(req, res, next) {
        try {
            const newOwner = await profileService.setOwner(req.params.id);
            return res.status(newOwner ? 200 : 400).json(newOwner);
        } catch(e) {
            next(e);
        }
    }

    async deleteOwner(req, res, next) {
        try {
            const deletedOwner = await profileService.deleteOwner(req.params.id);
            return res.status(deletedOwner ? 200 : 400).json(deletedOwner)
        } catch(e) {
            next(e);
        }
    }
}