const {Schema, model} = require("mongoose");

const OrderSchema = new Schema({
    purchaseId: {type: Schema.Types.ObjectId, ref: "Purchase", required: true},
    waiter: {type: Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: {type: Schema.Types.Date, required: true},
    finalPrice: {type: Number, required: true}
})

module.exports = model("Order", OrderSchema);