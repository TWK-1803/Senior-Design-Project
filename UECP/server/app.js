const express = require('express');
const CASAuthentication = require('express-cas-authentication');
const session = require('express-session');
const { check, oneOf, validationResult } = require('express-validator');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const axios = require('axios');
const ShipEngine = require('shipengine');
const short = require('short-uuid');
const itemModel = require('./schemas/item_schema_mongodb');
const userModel = require('./schemas/user_schema_mongodb');
const conversationModel = require('./schemas/conversation_schema_mongodb');
const orderModel = require('./schemas/order_schema_mongodb');
const typeOfDeals = require('./modules/typeOfDeals');
const itemCategories = require('./modules/itemCategories');
const categoryFilters = require('./modules/categoryFilters');
const conditions = require('./modules/conditions');
const types = require('./modules/types');

const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).array('image', 20);
const uploadStrategyCurUserInfo = multer({ storage: inMemoryStorage }).array('image', 1);
const uploadStrategyCurUserSocials = multer({ storage: inMemoryStorage }).none();
const uploadStrategyCurUserPaymentMethods = multer({ storage: inMemoryStorage }).none();
const uploadStrategyGeneral = multer({ storage: inMemoryStorage }).none();
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const password = '_\T9`Xb$-0_Hu$D';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = crypto.randomBytes(16);

const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');

const app = express();

app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

const containerName = process.env.VUE_APP_IMAGE_CONTAINER;
const containerNameProfiles = process.env.VUE_APP_PROFILES_IMAGE_CONTAINER;

const shipengine = new ShipEngine(process.env.SHIP_ENGINE_API);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_SRV, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}).then(()=>{
    console.log('Connected to the Database!')
}).catch((err) => {
    console.log(err)
});

let store = new MongoDBStore({
    uri: process.env.DB_SRV,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

app.use(session({
    secret: process.env.SECRET,
    store: store,
    resave: false,
    saveUninitialized: false,
}));

let cas = new CASAuthentication({
    cas_url: 'https://cas.latech.edu/cas',
    service_url: process.env.SERVICE_URL,
    renew: true,
    is_dev_mode: process.env.DEV_MODE === 'true',
    dev_mode_user: 'lll031@latech.edu',
    dev_mode_info: {
        mail: 'lll031@latech.edu'
    },
    session_name: 'casUser',
    session_info: 'casUserInfo',
    destroy_session: true
});

const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
    const pipeline = newPipeline(sharedKeyCredential);
    
const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline
);

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.UECP_EMAIL,
        pass: process.env.UECP_EMAIL_APP_PASSWORD,
    }
});
        
const getBlobName = originalName => {
    // Use a random number to generate a unique file name, 
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

const getDate = () => {
    const date = new Date();
    return date.toJSON().slice(0, 10);
}

// middleware to check if user logged in for the first time
const checkUserProfile = (req, res, next) => {
    userModel.findOne({email: req.session.casUser}, (err, user) => {
        if (err) {
            console.error(err);
        } else {
            if (user === null) {
                userModel.create({
                    profilePicture: 'default.jpg',
                    username: req.session.casUser.substring(0, req.session.casUser.indexOf('@')),
                    email: req.session.casUser,
                    fname: null,
                    lname: null,
                    phone_number: null,
                    ratings: [],
                    profilePic: null,
                    socials: {instagram: null, snapchat: null, facebook: null},
                    paymentMethods: {paypal: null, cashapp: null, venmo: null},
                    address: null,
                    userOnboarding: {addressComplete: false, addressSkippedDuringWelcome: false, paypalComplete: false, paypalSkippedDuringWelcome: false, }
                });
            }
        }
    });
    next();
}

const payPalGetAccessToken = async () => {
    return await axios({
        method: 'post',
        url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        auth: {
            username: process.env.PayPal_Client_ID,
            password: process.env.PayPal_Secret_Key
        },
        data: {
            'grant_type': 'client_credentials'
        }
    });
}

// ****************************************************************************************************
// ******************************************* POST methods *******************************************
// ****************************************************************************************************
app.post("/api/createItem", [
    cas.block, 
    uploadStrategy,
    check('title').not().isEmpty(), 
    check('description').not().isEmpty(), 
    check('typeOfDeal').not().isEmpty(),
    check('category').not().isEmpty(),
    check('price').isInt().not().isEmpty(),
    check('condition').not().isEmpty(),
    check('deliveryMethod').not().isEmpty(),
    check('files').custom((value, { req }) => {
        if (req.file) {
            return req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/x-png' || req.file.mimetype === 'image/png'
        } else if (req.files) {
            let valid = true;
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].mimetype !== 'image/jpeg' && req.files[i].mimetype !== 'image/x-png' && req.files[i].mimetype !== 'image/png') {
                    valid = false;
                }
            }
            return valid;
        } else {
            return false;
        }
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobName;
    let stream;
    let blockBlobClient;
    let imageNames = [];

    // iterate over every image file
    for (let i = 0; i < req.files.length; i++) {
        blobName = getBlobName(req.files[i].originalname);
        stream = getStream(req.files[i].buffer);
        blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            // put blob name of each image into imageNames
            imageNames[i] = blobName;

            // upload image file to blob storage
            await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
                blobHTTPHeaders: { blobContentType: "image/jpeg" }
            });

        } catch(err) {
            console.log(err);
        }
    }

    try {
        let filters = {};
        if (req.body.Type) {
            filters["type"] = req.body.Type;
        }
        if (req.body.Make) {
            filters["make"] = req.body.Make.toLowerCase();
        }
        if (req.body.Model) {
            filters["model"] = req.body.Model.toLowerCase();
        }
        if (req.body.Year) {
            filters["year"] = req.body.Year.toLowerCase();
        }
        if (req.body["Body Type"]) {
            filters["bodyType"] = req.body["Body Type"];
        }
        if (req.body.Mileage) {
            filters["mileage"] = parseInt(req.body.Mileage);
        }
        if (req.body["Interior Color"]) {
            filters["interiorColor"] = req.body["Interior Color"].toLowerCase();
        }
        if (req.body["Exterior Color"]) {
            filters["exteriorColor"] = req.body["Exterior Color"].toLowerCase();
        }
        if (req.body["Transmission Type"]) {
            filters["transmissionType"] = req.body["Transmission Type"];
        }
        if (req.body.Color) {
            filters["color"] = req.body.Color.toLowerCase();
        }
        if (req.body.Gender) {
            filters["gender"] = req.body.Gender;
        }
        if (req.body.Size) {
            filters["size"] = req.body.Size;
        }

        let deliveryMethod = {};
        if (req.body.deliveryMethod == "In-Person") {
            deliveryMethod["In-Person"] = "Pick Up"
        } else if (req.body.deliveryMethod == "Shipping") {
            deliveryMethod["Shipping"] = {};
            deliveryMethod["Shipping"]["Package Weight"] = {};
            deliveryMethod["Shipping"]["Package Weight"]["lbs."] = req.body.packageWeight[0];
            deliveryMethod["Shipping"]["Package Weight"]["oz."] = req.body.packageWeight[1];
            deliveryMethod["Shipping"]["Package Dimensions"] = {};
            deliveryMethod["Shipping"]["Package Dimensions"]["length (in.)"] = req.body.packageDimensions[0];
            deliveryMethod["Shipping"]["Package Dimensions"]["width (in.)"] = req.body.packageDimensions[1];
            deliveryMethod["Shipping"]["Package Dimensions"]["height (in.)"] = req.body.packageDimensions[2];
            deliveryMethod["Shipping"]["Domestic Carrier Service"] = JSON.parse(req.body.domesticShippingCarrierService);
            deliveryMethod["Shipping"]["Shipping Cost Type"] = req.body.costType;
            if (req.body.costType == "Flat Rate") {
                deliveryMethod["Shipping"]["Flat Rate"] = parseInt(req.body.flatRateShippingCost);
            }
        }

        // Use schema from item model to create a new test item
        // Will be modified later on to also reflect user who created the item
        userModel.findOne({email : req.session.casUser}, (err, user) => {
            if (err) {
                console.error(err);
                res.sendStatus(400);
            }
            else {
                itemModel.create({
                    title: req.body.title,
                    description : req.body.description,
                    typeOfDeal : req.body.typeOfDeal,
                    category : req.body.category,
                    price : req.body.price,
                    images : imageNames,
                    condition: req.body.condition,
                    deliveryMethod: deliveryMethod,
                    filters: filters,
                    sellerID: user.id,
                    sold: false,
                });
            }
        });
        
        // will be updated later on to redirect to the newly listed item page
        res.redirect("/");
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post("/api/createRating/:id", [
    cas.block,
    check('id').not().isEmpty().isMongoId(),
    check('rating').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const curUser = await userModel.findOne({email: req.session.casUser});
        const order = await orderModel.findOne({orderID: req.body.rating.orderID});
        const userToInsertFeedback = await userModel.findOne({_id: req.params.id});
        const item = await itemModel.findOne({_id: order.orderDetails.itemID});

        let rating = {
            stars: req.body.rating.starRating,
            comment: req.body.rating.feedback,
            ratingBy: curUser.username,
            orderID: req.body.rating.orderID,
            itemTitle: item.title,
        }

        userToInsertFeedback.ratings.push(rating);
        // curUser is buyer in the order
        if (curUser.id === order.orderDetails.buyerID) {
            order.feedback.buyerSent = true;
            order.feedback.sellerReceived = true;
        // curUser is seller in the order
        } else if (curUser.id === order.orderDetails.sellerID) {
            order.feedback.sellerSent = true;
            order.feedback.buyerReceived = true;
        }
        userToInsertFeedback.markModified('ratings');
        userToInsertFeedback.save();
        order.markModified('feedback');
        order.save();
        res.sendStatus(204);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.delete("/api/deleteItem/:id", [
    cas.block,
    check('id').not().isEmpty().isMongoId(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        itemModel.findOneAndDelete({"_id": req.params.id}, async (err, deletedItem) => {
            if (err){
                console.log(err);
                res.sendStatus(400);
            }
            else{
                let blockBlobClient;
                const containerClient = blobServiceClient.getContainerClient(containerName);

                const options = {
                    deleteSnapshots: "include"
                }

                for(let i = 0; i < deletedItem.images.length; i++) {
                    blockBlobClient = containerClient.getBlockBlobClient(deletedItem.images[i]);
                    await blockBlobClient.delete(options);
                }
                res.sendStatus(200);
            }
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.post('/api/updateCurUserInfo', [cas.block, uploadStrategyCurUserInfo], async (req, res) => {
    try {

        let curUser = await userModel.findOne({email: req.session.casUser});
        let curUserConversations = await conversationModel.find({$or : [{user1: curUser.id}, {user2: curUser.id}]});
        console.log(curUserConversations);

        if (req.body.firstName) {
            curUser.fname = req.body.firstName;
        }
        if (req.body.lastName) {
            curUser.lname = req.body.lastName;
        }
        if (req.body.phoneNumber !== '') {
            curUser.phone_number = req.body.phoneNumber;
        }
        if (req.files.length !== 0) {
            const containerClient = blobServiceClient.getContainerClient(containerNameProfiles);
    
            let blobName = getBlobName(req.files[0].originalname);
            let stream = getStream(req.files[0].buffer);
            let blockBlobClient = containerClient.getBlockBlobClient(blobName);

            let deleteImage = curUser.profilePicture;
    
            try {
                // upload image file to blob storage
                await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
                    blobHTTPHeaders: { blobContentType: "image/jpeg" }
                });
    
                curUser.profilePicture = blobName;

                curUserConversations.forEach(conversation => {
                    if (conversation.user1 === curUser.id) {
                        conversation.user1ProfilePicture = blobName;
                    } else if (conversation.user2 === curUser.id) {
                        conversation.user2ProfilePicture = blobName;
                    }
                    conversation.save();
                });

                if (deleteImage !== 'default.jpg') {
                    const options = {
                        deleteSnapshots: "include"
                    }
    
                    blockBlobClient = containerClient.getBlockBlobClient(deleteImage);
                    await blockBlobClient.delete(options);
                }

    
            } catch(err) {
                console.log(err);
            }
        }
    
        curUser.save();

        res.sendStatus(204);

    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post('/api/updateCurUserSocials', [cas.block, uploadStrategyCurUserSocials], (req, res) => {
    let updatedInfo = {};
    if (req.body.instagram) {
        updatedInfo["instagram"] = req.body.instagram;
    }
    if (req.body.snapchat) {
        updatedInfo["snapchat"] = req.body.snapchat;
    }
    if (req.body.facebook) {
        updatedInfo["facebook"] = req.body.facebook;
    }
    userModel.findOneAndUpdate({email: req.session.casUser}, { 
        socials: { 
            instagram: updatedInfo["instagram"], 
            snapchat: updatedInfo["snapchat"], 
            facebook: updatedInfo["facebook"] 
        } 
    }, null, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.redirect('/settings');
        }
    });
});

app.post('/api/updateCurUserPaymentMethods', [cas.block, uploadStrategyCurUserPaymentMethods], async (req, res) => {
    const user = await userModel.findOne({email: req.session.casUser});
    user.paymentMethods.cashapp = req.body.cashapp;
    user.paymentMethods.venmo = req.body.venmo;
    user.markModified('paymentMethods');
    user.save();
    res.redirect('/settings');
});

app.post('/api/updateCurUserAddress', [
    cas.block, 
    uploadStrategyGeneral,
    check('address_line_1').not().isEmpty(),
    check('admin_area_1').not().isEmpty(),
    check('admin_area_2').not().isEmpty(),
    check('postal_code').not().isEmpty(),
    check('country_code').not().isEmpty(),
], async (req, res) => {
    const user = await userModel.findOne({email: req.session.casUser});
    user.address = req.body;
    user.userOnboarding.addressComplete = true;
    user.markModified('userOnboarding');
    user.save();
    res.sendStatus(204);
});

app.post('/api/skipCurUserAddressOnboarding', cas.block, async (req, res) => {
    const user = await userModel.findOne({email: req.session.casUser});
    user.userOnboarding.addressSkippedDuringWelcome = true;
    user.markModified('userOnboarding');
    user.save();
    res.sendStatus(204);
});

app.post('/api/skipCurUserPayPalOnboarding', cas.block, async (req, res) => {
    const user = await userModel.findOne({email: req.session.casUser});
    user.userOnboarding.paypalSkippedDuringWelcome = true;
    user.markModified('userOnboarding');
    user.save();
    res.sendStatus(204);
});

app.put('/api/updateItem/:id', [
    cas.block, 
    uploadStrategy,
    check('id').not().isEmpty().isMongoId(),
    check().custom((value, {req}) => {
        const allowedFields = new Set(['title', 'description', 'typeOfDeal', 'category', 'price', 'condition', 'deleteImages']);
        const invalidFields = [];
        for (const field in req.body) {
            if (!allowedFields.has(field)) {
                invalidFields.push(field);
            }
        }
        if (invalidFields.length != 0) {
            throw new Error(`Invalid fields: ${invalidFields}`);
        } else {
            return true;
        }
    }),
    check('title').optional().exists(),
    check('description').optional().exists(),
    check('typeOfDeal').optional().exists(),
    check('category').optional().exists(),
    check('price').optional().exists().isInt(),
    check('condition').optional().exists(),
    check('deleteImages').optional().custom((value, { req }) => {
        if (Array.isArray(req.body.deleteImages) || typeof(req.body.deleteImages) === 'string') {
            return true; 
        } else {
            return false;
        }
    }),
    check('files').optional().custom((value, { req }) => {
        if (req.file) {
            return req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/x-png' || req.file.mimetype === 'image/png'
        } else if (req.files) {
            let valid = true;
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].mimetype !== 'image/jpeg' && req.files[i].mimetype !== 'image/x-png' && req.files[i].mimetype !== 'image/png') {
                    valid = false;
                }
            }
            return valid;
        } else {
            return false;
        }
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    itemModel.findOne({_id : req.params.id}, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            userModel.findOne({email : req.session.casUser}, async (err, user) => {
                if (err) {
                    console.log(err);
                } else if (user.id === item.sellerID) {
                    let item = await itemModel.findById({_id: req.params.id});
                    if (req.body.title) {
                        item.title = req.body.title;
                    }
                    if (req.body.description) {
                        item.description = req.body.description;
                    }
                    if (req.body.typeOfDeal) {
                        item.typeOfDeal = req.body.typeOfDeal;
                    }
                    if (req.body.category) {
                        item.category = req.body.category;
                    }
                    if (req.body.price) {
                        item.price = req.body.price;
                    }
                    if (req.body.condition) {
                        item.condition = req.body.condition;
                    }

                    let allowImageDelete = false;
                    let allowImageAdd = false;

                    if (req.body.deleteImages && req.files) {
                        if (typeof(req.body.deleteImages) === 'string') {
                            if (item.images.length - 1 + req.files.length > 0 && item.images.length - 1 + req.files.length <= 20) {
                                allowImageDelete = true;
                                allowImageAdd = true;
                            }
                        }
                        else if (item.images.length - req.body.deleteImages.length + req.files.length > 0 && item.images.length - req.body.deleteImages.length + req.files.length <= 20) {
                            allowImageDelete = true;
                            allowImageAdd = true;
                        }
                    } else if (req.body.deleteImages) {
                        if (typeof(req.body.deleteImages) === 'string') {
                            if (item.images.length - 1 > 0) {
                                allowImageDelete = true;
                            }    
                        }
                        else if (item.images.length - req.body.deleteImages.length > 0) {
                            allowImageDelete = true;
                        }
                    } else if (req.files) {
                        if (item.images.length + req.files.length <= 20) {
                            allowImageAdd = true;
                        }
                    }

                    if (allowImageDelete) {
                        console.log(req.body.deleteImages);
                        console.log(typeof(req.body.deleteImages));
                        if (typeof(req.body.deleteImages) === 'string') {
                            let index = item.images.indexOf(req.body.deleteImages);
                            if (index > -1) {
                                item.images.splice(index, 1);
                                let blockBlobClient;
                                const containerClient = blobServiceClient.getContainerClient(containerName);
                
                                const options = {
                                    deleteSnapshots: "include"
                                }

                                blockBlobClient = containerClient.getBlockBlobClient(req.body.deleteImages);
                                await blockBlobClient.delete(options);
                            }
                        }
                        else {
                            for (let i = 0; i < req.body.deleteImages.length; i++) {
                                let index = item.images.indexOf(req.body.deleteImages[i]);
                                if (index > -1) {
                                    item.images.splice(index, 1);
                                    
    
                                    let blockBlobClient;
                                    const containerClient = blobServiceClient.getContainerClient(containerName);
                    
                                    const options = {
                                        deleteSnapshots: "include"
                                    }
    
                                    blockBlobClient = containerClient.getBlockBlobClient(req.body.deleteImages[i]);
                                    await blockBlobClient.delete(options);
                                }
                            }
                        }
                    }
                    if (allowImageAdd) {
                        const containerClient = blobServiceClient.getContainerClient(containerName);
                        let blobName;
                        let stream;
                        let blockBlobClient;
                        for (let i = 0; i < req.files.length; i++) {
                            blobName = getBlobName(req.files[i].originalname);
                            stream = getStream(req.files[i].buffer);
                            blockBlobClient = containerClient.getBlockBlobClient(blobName);
                    
                            try {
                                // put blob name of each image into imageNames
                                item.images.push(blobName);
                    
                                // upload image file to blob storage
                                await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
                                    blobHTTPHeaders: { blobContentType: "image/jpeg" }
                                });
                    
                            } catch(err) {
                                console.log(err);
                            }
                        }
                        item.save();
                    }
                    // res.redirect(`/listing/${req.params.id}`);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            });
        }
    });
});

app.post("/api/sendMessage/:conversationID", [
    cas.block,
    check('conversationID').not().isEmpty().isMongoId()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(req.body.payload.text === ""){
        res.sendStatus(400);
    }
    try{
        userModel.findOne({email : req.session.casUser}, (err, user) => {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            } 
            conversationModel.findOne({_id: req.params.conversationID}, (err, conversation) =>{
                if (err){
                    console.log(err);
                    res.sendStatus(400);
                } else{
                    //let cipher = crypto.createCipheriv(algorithm, key, iv);
                    //let encrypted = Buffer.concat([cipher.update(req.body.payload.text), cipher.final()]).toString('base64');
                    if(user.id === conversation.user1 || user.id === conversation.user2){
                        conversationModel.findOneAndUpdate({_id: conversation._id}, 
                            {$push: { messages: {
                                senderID: req.body.payload.senderID,
                                receiverID: req.body.payload.receiverID,
                                text: req.body.payload.text
                            }},
                            }, function(err){
                                if(err){
                                    console.log(err);
                                    res.sendStatus(404);
                                } else{
                                    res.sendStatus(204);
                                }
                            }
                        );
                    }
                    else{
                        res.sendStatus(401);
                    }
                }
            });
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.post("/api/createConversation/:userID", [
        cas.block,
        check('userID').not().isEmpty().isMongoId()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const currUser = await userModel.findOne({email : req.session.casUser});
            const otherUser = await userModel.findOne({_id : req.params.userID});
            conversationModel.create({
                user1: currUser.id, 
                user1Username: currUser.username, 
                user2: req.params.userID, 
                user2Username: otherUser.username,
                user1ProfilePicture: currUser.profilePicture,
                user2ProfilePicture: otherUser.profilePicture, 
                messages: []
            }, (err, conversation) => {
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                } else{
                    res.send(conversation.id).status(204);
                }
            })
        }
        catch(err){
            console.log(err);
            res.sendStatus(400);
        }
});

app.post('/api/inPersonBuy/:id', [cas.block], async (req, res) => {
    const buyer = await userModel.findOne({email: req.session.casUser});
    const item = await itemModel.findOne({_id: req.params.id});
    const seller = await userModel.findOne({_id: item.sellerID});

    const order = await orderModel.create({
        orderID: short.generate(),
        orderType: "Pickup",
        orderDetails: {
            itemID: item.id,
            buyerID: buyer.id,
            buyerUsername: buyer.username,
            sellerID: seller.id,
            sellerUsername: seller.username,
            itemPickedUp: false,
            paid: false,
            codeGenerated: false,
            sixDigitCode: null,
        },
        orderStatus: "Pending",
        feedback: {
            buyerReceived: false,
            buyerSent: false,
            sellerReceived: false,
            sellerSent: false,
        }
    });
    const orderID = order.orderID;
    item.sold = true;
    item.save();

    let mailOptions = {
        from: process.env.UECP_EMAIL,
        to: seller.email,
        subject: `You sold: ${item.title}`,
        text: `Set Up a meeting location with ${buyer.username}`,
        attachDataUrls: true,
        html: '<h2>Great News! ' + item.title + ' was sold.</h2><br><p>Go to Seller Hub and generate pickup code for your buyer.</p><br><p>Then meet with buyer to complete the transaction.</p>',
    }

    transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email sent");
            res.sendStatus(204);
        }
    });

    res.status(200).json({ orderID });
});

app.post('/api/generatePickupCode/:id', cas.block, async (req, res) => {
    const item = await itemModel.findOne({_id: req.params.id});
    const order = await orderModel.findOne({orderID: req.body.orderID});
    const buyer = await userModel.findOne({_id: order.orderDetails.buyerID});

    let sixDigitCode = Math.floor(100000 + Math.random() * 900000);
    
    // encode url with generated code query param
    let img = await qrcode.toDataURL(`${process.env.RETURN_BASE_URL}/confirmCode/?orderID=${order.orderID}&code=${sixDigitCode}`, {scale: 10});

    let mailOptions = {
        from: process.env.UECP_EMAIL,
        to: buyer.email,
        subject: `Code for Item: ${item.title}`,
        text: `Code for local pickup`,
        attachDataUrls: true,
        html: '<h1>Present the following:</h1><p>6 digit code: ' + sixDigitCode + '</p><br>OR<br><img src="' + img + '">',
    }

    transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email sent");
            order.orderDetails.codeGenerated = true;
            order.orderDetails.sixDigitCode = sixDigitCode;
            order.markModified('orderDetails');
            order.save();
            res.sendStatus(204);
        }
    });
});

app.post('/api/confirmPickupCode/:orderID', cas.block, async (req, res) => {
    try {
        let curUser = await userModel.findOne({email: req.session.casUser});
        let order = await orderModel.findOne({orderID: req.params.orderID});
        
        if (order.orderDetails.sellerID === curUser.id) {
            if (order.orderDetails.sixDigitCode == req.body.code) {
                order.orderDetails.itemPickedUp = true;
                if (order.orderDetails.codeGenerated == true && order.orderDetails.paid == true) {
                    order.orderStatus = 'Completed'
                }
                order.markModified('orderDetails');
                order.save();
                res.send({ codeConfirm: true }).status(204)
            } else if (order.orderDetails.sixDigitCode != req.body.code) {
                res.send({ codeConfirm: false }).status(400);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.send({ codeConfirm: false }).status(400);
        }
    } catch(err) {
        console.log(err);
        res.send({ codeConfirm: false }).status(400);
    }
});

app.post('/api/markItemAsPaid/:orderID', cas.block, async (req, res) => {
    let order = await orderModel.findOne({orderID: req.params.orderID});
    order.orderDetails.paid = true;
    if (order.orderDetails.codeGenerated == true && order.orderDetails.itemPickedUp == true) {
        order.orderStatus = 'Completed'
    }
    order.markModified('orderDetails');
    order.save();
    res.sendStatus(204);
});

app.post('/api/createShippingOrder/:id', cas.block, async (req, res) => {
    let item = await itemModel.findOne({_id: req.params.id});
    let curUser = await userModel.findOne({email: req.session.casUser});
    let seller = await userModel.findOne({_id: item.sellerID});
    item.sold = true;

    orderModel.create({
        orderID: req.body.id,
        orderType: "Shipping",
        orderDetails: {
            itemID: item.id,
            buyerID: curUser.id,
            buyerUsername: curUser.username,
            sellerID: seller.id,
            sellerUsername: seller.username,
            buyerPaid: req.body.purchase_units[0].payments.captures[0].final_capture,
            itemShipped: false,
            labelCreated: false,
            sellerName: `${seller.fname} ${seller.lname}`,
            shipFromAddress: seller.address,
            buyerName: `${curUser.fname} ${curUser.lname}`,
            buyerNameOnPayPal: req.body.purchase_units[0].shipping.name.full_name,
            shipToAddress: req.body.payer.address,
            totalAmount: req.body.purchase_units[0].amount.value,
            shippingInfo: item.deliveryMethod.Shipping
        },
        orderStatus: "Pending",
        feedback: {
            buyerReceived: false,
            buyerSent: false,
            sellerReceived: false,
            sellerSent: false,
        }
    });
    
    item.save();

    let mailOptions = {
        from: process.env.UECP_EMAIL,
        to: seller.email,
        subject: `You sold: ${item.title}`,
        text: `Ship Item ${item.title}`,
        attachDataUrls: true,
        html: '<h2>Great News! ' + item.title + ' was sold.</h2><br><p>Go to Seller Hub and create shipping label then ship the item!</p>',
    }

    transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email sent");
            res.sendStatus(204);
        }
    });

    res.sendStatus(204);
});

app.post('/api/paypalOnboard', cas.block, async (req, res) => {
    const token = await payPalGetAccessToken();

    const response = await axios({
        method: 'post',
        url: 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.data.access_token
        },
        data: {
            "operations": [
                {
                    "operation": "API_INTEGRATION",
                    "api_integration_preference": {
                        "rest_api_integration": {
                            "integration_method": "PAYPAL",
                            "integration_type": "FIRST_PARTY",
                            "first_party_details": {
                                "features": [
                                    "PAYMENT",
                                    "REFUND",
                                    "INVOICE_READ_WRITE",
                                    "ACCESS_MERCHANT_INFORMATION"
                                ],
                                "seller_nonce": token.data.nonce
                            }
                        }
                    }
                }
            ],
            "products": [
                "EXPRESS_CHECKOUT"
            ],
            "legal_consents": [
                {
                    "type": "SHARE_DATA_CONSENT",
                    "granted": true
                }
            ],
            "partner_config_override": {
                "return_url": `${process.env.RETURN_BASE_URL}/api/paypalOnboardComplete`
            }
        }
    });

    res.redirect(response.data.links[1].href);
});

app.post('/api/createShippingLabel', cas.block, async (req, res) => {
    const item = await itemModel.findOne({_id: req.body.itemID});
    const order = await orderModel.findOne({orderID: req.body.orderID});

    const params = {
        shipment: {
            serviceCode: order.orderDetails.shippingInfo["Domestic Carrier Service"].serviceCode,
            shipTo: {
                name: order.orderDetails.buyerNameOnPayPal,
                phone: "333-333-3333",
                addressLine1: order.orderDetails.shipToAddress.address_line_1,
                cityLocality: order.orderDetails.shipToAddress.admin_area_2,
                stateProvince: order.orderDetails.shipToAddress.admin_area_1,
                postalCode: order.orderDetails.shipToAddress.postal_code,
                countryCode: order.orderDetails.shipToAddress.country_code,
                addressResidentialIndicator: "yes",
            },
            shipFrom: {
                name: order.orderDetails.sellerName,
                phone: "333-333-3333",
                addressLine1: order.orderDetails.shipFromAddress.address_line_1,
                cityLocality: order.orderDetails.shipFromAddress.admin_area_2,
                stateProvince: order.orderDetails.shipFromAddress.admin_area_1,
                postalCode: order.orderDetails.shipFromAddress.postal_code,
                countryCode: order.orderDetails.shipFromAddress.country_code,
                addressResidentialIndicator: "yes",
            },
            packages: [
                {
                    weight: {
                        value: (order.orderDetails.shippingInfo["Package Weight"]["oz."] + order.orderDetails.shippingInfo["Package Weight"]["lbs."] * 16),
                        unit: "ounce",
                    },
                    dimensions: {
                        height: order.orderDetails.shippingInfo["Package Dimensions"]["height (in.)"],
                        width: order.orderDetails.shippingInfo["Package Dimensions"]["width (in.)"],
                        length: order.orderDetails.shippingInfo["Package Dimensions"]["length (in.)"],
                        unit: "inch",
                    },
                },
            ],
        },
    }

    try {
        const response = await shipengine.createLabelFromShipmentDetails(params);
        const result = await shipengine.trackUsingLabelId(response.labelId);
    
        order.orderDetails.labelInfo = response;
        order.orderDetails.labelCreated = true;

        order.orderDetails.trackingInfo = result;

        order.markModified('orderDetails');
        order.save();
        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post('/api/updateCurUserAllTrackingInfo', cas.block, async (req, res) => {
    const curUser = await userModel.findOne({email: req.session.casUser});
    const orders = await orderModel.find({'orderDetails.buyerID': curUser.id, 'orderDetails.trackingInfo': { $exists: true }});

    try {
        if (orders.length > 0) {
            orders.forEach(async order => {
                const trackingInfo = await shipengine.trackUsingLabelId(order.orderDetails.labelInfo.labelId);
                order.orderDetails.trackingInfo = trackingInfo;
                order.markModified('orderDetails.trackingInfo');
                order.save();
            });
        }
        res.sendStatus(204);
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

// ****************************************************************************************************
// ******************************************* GET methods ********************************************
// ****************************************************************************************************
app.get('/', [cas.bounce, checkUserProfile]);

app.get('/api/paypalOnboardComplete', cas.block, async (req, res) => {
    let curUser = await userModel.findOne({email: req.session.casUser});
    curUser.paymentMethods.paypal = req.query.merchantId;
    curUser.userOnboarding.paypalComplete = true;
    curUser.markModified('paymentMethods');
    curUser.markModified('userOnboarding');
    curUser.save();
    res.redirect('/');
});

app.get('/api/getOrder/:id', cas.block, async (req, res) => {
    orderModel.findOne({orderID: req.params.id}, (err, order) => {
        if (err) {
            console.error(err);
        } else if (order) {
            res.send(order);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/api/getOrders', cas.block, async (req, res) => {
    let user = await userModel.findOne({email: req.session.casUser});

    let query = {};

    if(req.query.ordersAs == 'buyer') {
        query['orderDetails.buyerID'] = user.id;
    } else if (req.query.ordersAs == 'seller') {
        query['orderDetails.sellerID'] = user.id;
    }

    orderModel.find(query, (err, orders) => {
        if (err) {
            console.error(err);
        } else if (orders) {
            res.send(orders);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/api/getCurrentUser', cas.block, (req, res) => {
    userModel.findOne({email: req.session.casUser} ,(err, user) => {
        if (err) {
            console.error(err);
            res.send(err).status(400);
        } else if (user) {
            res.send(user).status(200);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get("/api/getItem", cas.block, (req, res) => {
    const query = req.query;
    query["sold"] = false;
    if (query.minPrice || query.maxPrice) {
        query["price"] = {};
        if (query.minPrice) {
            Object.assign(query["price"], { $gte: query.minPrice })
            delete query.minPrice;
        }
        if (query.maxPrice) {
            Object.assign(query["price"], { $lte: query.maxPrice })
            delete query.maxPrice;
        }
    }
    if (query.fromDate || query.toDate) {
        query["createdAt"] = {};
        if (query.fromDate) {
            Object.assign(query["createdAt"], { $gte: query.fromDate })
            delete query.fromDate;
        }
        if (query.toDate) {
            Object.assign(query["createdAt"], { $lte: query.toDate })
            delete query.toDate;
        }
    }
    if (query.minMileage || query.maxMileage) {
        query["filters.mileage"] = {}
        if (query.minMileage) {
            Object.assign(query["filters.mileage"], { $gte: parseInt(query.minMileage) })
            delete query.minMileage;
        }
        if (query.maxMileage) {
            Object.assign(query["filters.mileage"], { $lte: parseInt(query.maxMileage) })
            delete query.maxMileage;
        }
    }
    if (query.deliveryMethod) {
        if (query.deliveryMethod === "Shipping") {
            query["deliveryMethod.Shipping"] = {"$exists" : true };
            delete query.deliveryMethod;
        } else if (query.deliveryMethod === "In-Person") {
            query["deliveryMethod.In-Person"] = "Pick Up"
            delete query.deliveryMethod;
        }
    }
    if (query.type) {
        query["filters.type"] = query.type;
        delete query.type;
    }
    if (query.make) {
        query["filters.make"] = query.make.toLowerCase();
        delete query.make;
    }
    if (query.model) {
        query["filters.model"] = query.model.toLowerCase();
        delete query.model;
    }
    if (query.interiorColor) {
        query["filters.interiorColor"] = query.interiorColor.toLowerCase();
        delete query.interiorColor;
    }
    if (query.exteriorColor) {
        query["filters.exteriorColor"] = query.exteriorColor.toLowerCase();
        delete query.exteriorColor;
    }
    if (query.year) {
        query["filters.year"] = query.year.toLowerCase();
        delete query.year;
    }
    if (query.color) {
        query["filters.color"] = query.color.toLowerCase();
        delete query.color;
    }
    if (query.size) {
        query["filters.size"] = query.size;
        delete query.size;
    }
    if (query.bodyType) {
        query["filters.bodyType"] = query.bodyType;
        delete query.bodyType;
    }
    if (query.transmissionType) {
        query["filters.transmissionType"] = query.transmissionType;
        delete query.transmissionType;
    }
    itemModel.find(query, (err, items) => {
        if (err){
            console.log(err);
            res.sendStatus(400);
        }
        if (items === [] || items === null){
            console.log("No database entries found with that criteria")
            res.sendStatus(404)
        }
        else{
            res.send(items).status(200);
            }
    });
});

app.get("/api/getItem/:id", [
    cas.block,
    check('id').not().isEmpty().isMongoId(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    itemModel.findOne({_id: req.params.id}, function(err, item) {
        if (err){
            console.error(err);
            res.sendStatus(400);
        } else if (item) {
            res.send(item).status(200);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/api/getCurUserItems', cas.block, async (req, res) => {
    userModel.findOne({email: req.session.casUser} , async (err, user) => {
        if (err) {
            console.error(err);
            res.send(err).status(400);
        } else if (user) {
            let item = await itemModel.find({sellerID: user.id});
            res.send(item);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/api/getCurUserBoughtItems', cas.block, async (req, res) => {
    userModel.findOne({email: req.session.casUser}, async (err, user) => {
        if (err) {
            console.error(err);
            res.send(err).status(400);
        } else if (user) {
            let curUserOrders = await orderModel.find({'orderDetails.buyerID': user.id});
            let boughtItemIDs = [];
            curUserOrders.forEach(order => boughtItemIDs.push(order.orderDetails.itemID));
            let allBoughtItems = await itemModel.find({_id: {$in: boughtItemIDs}});
            res.send(allBoughtItems);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get("/api/getFilters", cas.block, (req, res) => {
    res.send(categoryFilters).status(200);
});

app.get("/api/getConditions", cas.block, (req, res) => {
    res.send(conditions).status(200);
});

app.get("/api/getTypes", cas.block, (req, res) => {
    res.send(types).status(200);
});

app.get("/api/getSellerInfo/:id", [
    cas.block,
    check('id').not().isEmpty().isMongoId(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        userModel.findById(req.params.id ,(err, result) => {
            if (err) {
                console.error(err);
                res.send(err).status(400);
            } else if (result) {
                res.send(result).status(200);
            } else {
                res.sendStatus(404);
            }
        });

    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.get("/api/getCategories", cas.block, (req, res) => {
    res.send(itemCategories).status(200);
});

app.get("/api/getTypeOfDeals", cas.block, (req, res) => {
    res.send(typeOfDeals).status(200);
});

app.get('/api/logout', cas.logout);

app.get("/api/getMessages/:conversationID", [
    cas.block, 
    check('conversationID').not().isEmpty().isMongoId()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        conversationModel.findOne({_id: req.params.conversationID}, (err, conversation) => {
            if(err) {
                console.log(err);
                res.sendStatus(404);
            } else if(conversation){
                userModel.findOne({email: req.session.casUser}, (err, user) => {
                    if(err) {
                        console.log(err);
                        res.sendStatus(404);
                    } else if(user.id === conversation.user1 || user.id === conversation.user2) {
                        let results = []
                        conversation.messages.forEach(message => {
                            //let decipher = crypto.createDecipheriv(algorithm, key, iv);
                            //let decrypted = Buffer.concat([decipher.update(message.text, 'base64'), decipher.final()]).toString('utf-8');
                            results.push({
                                senderID: message.senderID,
                                receiverID: message.receiverID,
                                text: message.text,
                                createdAt: message.createdAt
                            })
                        })
                        res.send({messages: results}).status(200);
                    } else{
                        console.log(err);
                        res.sendStatus(401);
                    }
                })
            }
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.get("/api/getConversations", cas.block, (req, res) => {
    try{
        userModel.findOne({email : req.session.casUser}, (err, user) => {
            if (err) {
                console.log(err);
            } 
            conversationModel.find({$or : [{user1: user.id}, {user2: user.id}]}, '_id user1 user1Username user2 user2Username user1ProfilePicture user2ProfilePicture',
                function(err, conversations) {
                    if (err){
                        console.log(err);
                        res.sendStatus(400);
                    }
                    else{
                        res.send(conversations).status(204);
                    }
                }
            );
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.get('/api/getConversationID/:userID1/:userID2', [
        cas.block, 
        check('userID1').not().isEmpty().isMongoId(),
        check('userID2').not().isEmpty().isMongoId()
    ],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        userModel.findOne({email : req.session.casUser}, (err, user) => {
            if (err) {
                console.log(err);
            } else if (user.id === req.params.userID1 || user.id === req.params.userID2) {
                conversationModel.findOne({$or : [
                    {$and : [{user1: req.params.userID1}, {user2: req.params.userID2}]},
                    {$and : [{user1: req.params.userID2}, {user2: req.params.userID1}]}
                ]}, '_id', function(err, conversationID) {
                        if (err){
                            console.log(err);
                            res.sendStatus(400);
                        }
                        else{
                            if(conversationID === null){
                                res.send("").status(204);
                            } else{
                                res.send(conversationID._id).status(204);
                            }
                        }
                    }
                );
            } else {
                res.sendStatus(401);
            }
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.get('/api/getProfilePicture/:userID', [
    cas.block,
    check('userID').not().isEmpty().isMongoId()
 ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        userModel.findOne({_id: req.params.userID}, "profilePicture", (err, picture) => { 
            if (err){
                console.log(err);
                res.sendStatus(400);
            }
            else{
                res.send(picture).status(204);
            }
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.get('/api/getCarrierServices', cas.block, (req, res) => {
    shipengine.listCarriers().then((list) => {
        let listCarrierServices = {};
        list.forEach(carrier => {
            let services = []
            carrier.services.forEach(carrierService => {
                if (carrierService.domestic == true && carrierService.serviceCode !== "globalpost_parcel_select_smart_saver") {
                    services.push({
                        carrierId: carrierService.carrierId,
                        serviceCode: carrierService.serviceCode,
                        name: carrierService.name,
                    });
                }
            })
            listCarrierServices[carrier.friendlyName] = services;
        })
        res.send(listCarrierServices);
    }).catch(err => {
        console.log(err);
    })
});

// Handles SPA
if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname + '/public/'));
    app.get(/.*/, [cas.bounce, checkUserProfile], (req, res) => res.sendFile(__dirname + '/public/index.html'));
};

module.exports = app;