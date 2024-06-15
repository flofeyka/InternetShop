const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String, unique: true, default: "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1"},
    passwordHash: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    purchasesHistory: {type: Array, required: true, ref: "Purchase"},
    ownProducts: {type: Array, required: true, ref: "Purchase"},
    gender: {type: String, default: "null"},
    isOwner: {type: Boolean, required: true, default: false},
    myOrders: {type: Array, required: true, ref: "Order"},
    favourites: {type: Array, ref: "Purchase"},
    cart: {type: Array, required: true, ref: "Purchase"},
    ordersOnMyProducts: {type: Array, required: true, ref: "Order"},
    createdAt: {type: Date, required: true}
});

module.exports = model("User", UserSchema);