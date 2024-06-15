const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    purchaseId: {type: Schema.Types.ObjectId, ref: "Purchase", required: true},
    waiter: {type: Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    finalPrice: {type: Number, required: true},
    isTaken: {type: Boolean, default: false},
    address: {type: String, required: true},
    deadline: {type: String, required: true} //string
})

module.exports = model("Order", OrderSchema);