const User = require("../models/User");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const UserDto = require("../dtos/userDto");
const ApiError = require ("../exceptions/api-error");

module.exports = new class authService {
    async login(email, password) {
        const userFound = await User.findOne({email});
        if (!userFound) {
            throw ApiError.BadRequest("Wrong email or password")
        }

        const passwordCompared = await bcrypt.compare(password, userFound.passwordHash);
        if (!passwordCompared) {
            throw ApiError.BadRequest("Wrong email or password")
        }
        const userDto = new UserDto(userFound)
        const {refreshToken, accessToken} = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, refreshToken);

        return {
            user: userDto, refreshToken, accessToken
        }
    }

    async register(name, email, phoneNumber, password) {
        const userFound = await User.findOne({email});
        if (userFound) {
            throw ApiError.BadRequest("User with this email is already exist")
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            name, email, phoneNumber, passwordHash, createdAt: new Date()
        });

        const userDto = new UserDto(createdUser);

        const {refreshToken, accessToken} = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, refreshToken);

        return {
            user: userDto,
            refreshToken, accessToken
        }

    }

    async refresh(refreshToken) {
        const usersData = tokenService.validateRefreshToken(refreshToken);
        const tokenFound = tokenService.findToken(refreshToken);
        if(!usersData || !tokenFound) {
            throw ApiError.notFound("Token is not found")
        }

        const user = await User.findById(usersData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            user: userDto, ...tokens
        }

    }

    async logout(refreshToken) {
        if(refreshToken) {
            const deletedToken = await tokenService.removeToken(refreshToken);
            return deletedToken.deletedCount === 1;
        }

        throw ApiError.BadRequest("Invalid token")
    }

    async updatePassword(id, oldPassword, password) {
        const user = await User.findById(id);
        const passwordCompare = await bcrypt.compare(oldPassword, user.passwordHash);
        if(!passwordCompare) {
            throw ApiError.BadRequest("Wrong old password");
        }
        if(await bcrypt.compare(password, user.passwordHash)) {
            throw ApiError.BadRequest("Passwords should not be repeated")
        }
        if(passwordCompare) {
            const newPassword = await bcrypt.hash(password, 10);
            const user = await User.updateOne({_id: id}, {
                passwordHash: newPassword
            })
            return user.modifiedCount === 1;
        }
    }
}