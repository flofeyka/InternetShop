const User = require("../models/User");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const UserDto = require("../dtos/userDto");
const Token = require("../models/Token");
const ApiError = require ("../exceptions/api-error");

module.exports = new class authService {
    async login(email, password) {
        const userFound = await User.findOne({email});
        const userDto = new UserDto(userFound)
        if (!userFound) {
            throw ApiError.BadRequest(400, "Wrong email or password")
        }

        const passwordCompared = await bcrypt.compare(password, userFound.passwordHash);
        if (!passwordCompared) {
            throw ApiError.BadRequest(400, "Wrong email or password")
        }

        const {refreshToken, accessToken} = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, refreshToken);

        return {
            user: userDto, refreshToken, accessToken
        }
    }

    async register(name, email, password) {
        const userFound = await User.findOne({email});
        if (userFound) {
            throw ApiError.BadRequest(400, "User with this email is already exist")
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            name, email, passwordHash, createdAt: new Date()
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
        console.log(usersData);
        if(!usersData || !tokenFound) {
            throw ApiError.notFound(404, "Token is not found")
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

        throw ApiError.BadRequest(400, "Invalid token")
    }

    async updatePassword(id, oldPassword, password) {
        const user = await User.findById(id);
        const passwordCompare = await bcrypt.compare(User.passwordHash, oldPassword);
        if(passwordCompare) {
            const newPassword = await bcrypt.hash(password, 10);
            const user = await User.updateOne({_id: id}, {
                passwordHash: newPassword
            })
            return user.modifiedCount === 1;
        }
        return undefined;
    }
}