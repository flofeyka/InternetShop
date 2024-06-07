const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    purchasesHistory: {type: Array, required: true, ref: "Purchase"},
    ownProducts: {type: Array, required: true, ref: "Purchase"},
    myOrders: {type: Array, required: true, ref: "Order"},
    favourites: {type: Array, ref: "Purchase"},
    cart: {type: Array, required: true, ref: "Purchase"},
    ordersOnMyProducts: {type: Array, required: true, ref: "Order"},
    createdAt: {type: Date, required: true}
});

module.exports = model("User", UserSchema);