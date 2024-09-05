const mongoose = require('mongoose');
const { Schema } = mongoose;
const collectionName = "users";

const userSchema = new Schema({
	profilePicture: String,
	username : String,
	email : String,
	fname : String,
	lname : String,
	phone_number : String,
	ratings : Array,
	profilePic: String,
	socials: Object,
	paymentMethods: Object,
	address: Object,
	userOnboarding: Object,
}, { timestamps: true })

const model = mongoose.model("users", userSchema, collectionName);
module.exports = model;