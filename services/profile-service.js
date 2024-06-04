const User = require("../models/User");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/api-error");

module.exports = new class profileService {
    async updateUserInfo(id, name, phoneNumber, email, image) {
        if (email) {
            const user = await User.findOne({email});
            if (user) {
                throw ApiError.BadRequest(400, "User with this email is already exist");
            }
        }
        if (phoneNumber) {
            const user = await User.findOne({phoneNumber});
            if (user) {
                throw ApiError.BadRequest(400, "User with this phone number is already exist");
            }
        }
        const updatedUser = await User.updateOne({_id: id}, {
            name, phoneNumber, email, image
        });
        if (updatedUser.modifiedCount === 1) {
            const userData = await User.findById(id);
            const userDto = new UserDto(userData);
            return {...userDto, phoneNumber: userData.phoneNumber}
        } else {
            throw ApiError.BadRequest(400, "Nothing to update");
        }

    }


}