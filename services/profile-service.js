const User = require("../models/User");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const Uuid = require("uuid");

module.exports = new class profileService {
    async updateUserInfo(id, name, phoneNumber, email, file) {
        if(file) {
            const user = await User.findById(id);
            const avatarName = Uuid.v4() + ".jpg";
            file.mv(config.get("staticPath") + "\\" + avatarName);
            user.image = avatarName;
            await user.save();
        }
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
            const userData = await this.getUserInfoById(id);
            return userData;
        } else {
            throw ApiError.BadRequest(400, "Nothing to update");
        }

    }

    async getMyOrders(userId) {
        const user = await User.findById(userId);
        let orders = [];
        for(let i = 0; i < user.myOrders.length; i++) {
            const order = Order.findOne(user.myOrders[i]);
            orders.push(order);
        }

        return orders;
    }

    async getUserInfoById(id) {
        if(!id) {
            throw ApiError.BadRequest("Wrong user id");
        }

        const profileInfo = await User.findById(id);
        if(!profileInfo) {
            throw ApiError.notFound(404, "User with this id is not found");
        }

        const userOrders = await Order.find({waiter: id});
        let amountOfOrders = 0;
        let takenOrders = 0;

        for(let i = 0; i < userOrders.length; i++) {
            amountOfOrders += userOrders[i].finalPrice;
            if(userOrders[i].isTaken) {
                takenOrders += 1;
            }
        }
        const userDto = new UserDto(profileInfo);
        console.log(userDto)
        return {
            ...userDto,
            amountOfOrders,
            percentOfBuyers: takenOrders / userOrders.length * 100
        }
    }


}