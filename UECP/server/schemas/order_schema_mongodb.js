const mongoose = require('mongoose');
const { Schema } = mongoose;
const collectionName = "orders";

const orderSchema = new Schema({
	orderID: String,
    orderType: String,
    orderDetails: Object,
    orderStatus: String,
    feedback: Object,
}, { timestamps: true })

const model = mongoose.model("orders", orderSchema, collectionName);
module.exports = model;