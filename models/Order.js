const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    productId: {type: Schema.Types.ObjectId, ref: "Purchase", required: true},
    waiter: {type: Schema.Types.ObjectId, ref: "User", required: true},
    isTaken: {type: Boolean, required: true, default: false},
    isVerified: {type: Boolean, default: false, required: true},
    finalPrice: {type: Number},
    canceled: {type: Boolean, default: false},
    address: {type: Object},
    isVerified: {type: Boolean, default: false},
    createdAt: {type: Date}
});

module.exports = model("Order", OrderSchema);