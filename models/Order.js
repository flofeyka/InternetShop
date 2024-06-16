const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    productsData: {type: Object, required: true},
    waiter: {type: Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    finalPrice: {type: Number, required: true},
    isTaken: {type: Boolean, default: false},
    canceled: {type: Boolean, default: false},
    address: {type: Object, required: true},
    isVerified: {type: Boolean, default: false}
});

module.exports = model("Order", OrderSchema);