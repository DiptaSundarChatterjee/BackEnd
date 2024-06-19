const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Login_signup")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['admin', 'student', 'instructor'], 
        required: true
    }
});


const User = mongoose.model("User", LoginSchema);

module.exports = User;
