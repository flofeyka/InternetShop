const {Schema, model} = require("mongoose");

const purchaseSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    description: {type: String},
    ordersCount: {type: Number, default: 0},
    viewsCount: {type: Number, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    image: {type: String, default: "default-product-icon.png"},
    sort: {type: String, required: true}
})

module.exports = model("Purchase", purchaseSchema)