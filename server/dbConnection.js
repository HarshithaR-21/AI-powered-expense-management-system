const mongoose = require('mongoose');
require("dotenv").config();
const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = dbConnection;