const mongoose = require('mongoose');
const { Schema } = mongoose;
const collectionName = "conversations";

const conversationSchema = new Schema({
	user1 : String,
    user1Username: String,
    user2: String,
    user2Username: String,
    user1ProfilePicture: String,
    user2ProfilePicture: String,
    messages: 
    [{
        type: new Schema({
            senderID: String,
            receiverID: String,
            text: String
        }, {timestamps: true})
    }]
})

const model = mongoose.model("conversations", conversationSchema, collectionName);
module.exports = model;