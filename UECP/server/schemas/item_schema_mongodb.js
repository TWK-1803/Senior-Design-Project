const mongoose = require('mongoose');
const { Schema } = mongoose;
const collectionName = "items";

const itemSchema = new Schema({
	title : String,
	description : String,
	typeOfDeal : String,
	category : String,
	price : Number,
	images : [{ type : String }],
	condition: String,
	deliveryMethod : Object,
	filters : Object,
	sellerID: String,
	sold: Boolean,
	draft: Boolean,
}, { timestamps: true });

const model = mongoose.model("items", itemSchema, collectionName);
module.exports = model;