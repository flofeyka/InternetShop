const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    createdAt: {type: Date, required: true}
});

module.exports = model("User", UserSchema);