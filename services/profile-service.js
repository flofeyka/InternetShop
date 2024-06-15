const User = require("../models/User");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const Uuid = require("uuid");
const config = require("config");

module.exports = new class profileService {
    async updateUserInfo(id, name, phoneNumber, email, file, gender) {
        let image = "";
        if (file) {
            const avatarName = Uuid.v4() + ".jpg";
            file.mv(config.get("staticPath") + "\\" + avatarName);
            image = avatarName;
        }
        if (email) {
            const user = await User.findOne({ email });
            if (user) {
                throw ApiError.BadRequest("User with this email is already exist");
            }
        }
        if (phoneNumber) {
            const user = await User.findOne({ phoneNumber });
            if (user) {
                throw ApiError.BadRequest("User with this phone number is already exist");
            }
        }
        if(gender) {
            switch (gender) {
                case "male":
                    break;
                case "female":
                    break;
                case "null":
                    break;
                default: 
                    throw ApiError.BadRequest("Wrong gender")
                    break;
            }
        }
        console.log(image);
        const updatedUser = await User.updateOne({ _id: id }, {
            name, phoneNumber, email, gender, image
        });
        if (updatedUser.modifiedCount === 1) {
            const userData = await this.getUserInfoById(id);
            return userData;
        } 
        return updatedUser;
    }

    async getMyOrders(userId) {
        const user = await User.findById(userId);
        let orders = [];
        for (let i = 0; i < user.myOrders.length; i++) {
            const order = Order.findOne(user.myOrders[i]);
            orders.push(order);
        }

        return orders;
    }

    async getUserInfoById(id) {
        if (!id) {
            throw ApiError.BadRequest("Wrong user id");
        }

        const profileInfo = await User.findById(id);
        if (!profileInfo) {
            throw ApiError.notFound("User with this id is not found");
        }

        const userOrders = await Order.find({ waiter: id });
        let amountOfOrders = 0;
        let takenOrders = 0;

        for (let i = 0; i < userOrders.length; i++) {
            amountOfOrders += userOrders[i].finalPrice;
            if (userOrders[i].isTaken) {
                takenOrders += 1;
            }
        }
        const userDto = new UserDto(profileInfo);
        return {
            ...userDto,
            amountOfOrders,
            percentOfBuyers: takenOrders / userOrders.length * 100
        }
    }

    async setOwner(id) {
        const user = await User.findById(id);
        if (!user) {
            throw ApiError.notFound("This user is not found");
        }

        if (user.isOwner) {
            throw ApiError.BadRequest("This user is already owner");
        }

        const updated = await User.updateOne({ _id: id }, {
            isOwner: true
        });
        if (updated.modifiedCount === 1) {
            return new UserDto(user);
        };

        return undefined;
    }

    async deleteOwner(id) {
        const user = await User.findById(id);
        if (!user.isOwner) {
            throw ApiError.BadRequest("This user is not an owner");
        }
        const owners = await User.find({ isOwner: true });
        if (owners.length < 2) {
            throw ApiError.BadRequest("There are must 2 owners minimum");
        }


        const updated = await User.updateOne({ _id: id }, {
            isOwner: false
        });

        if (updated.modifiedCount === 1) {
            const userDto = new UserDto(user);
            return userDto;
        }

        return undefined;
    }

    async getOwners() {
        const ownerList = await User.find({ isOwner: true });
        return ownerList.map(owner => {
            const ownerDto = new UserDto(owner);
            return ownerDto;
        });
    }



}