const {Schema, model} = require("mongoose");

const purchaseSchema = new Schema({
    name: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    viewersCount: {type: Number, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    image: {type: String, required: true},
    sort: {type: String, required: true}
})