const user = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");


const handleSignUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userFound = await user.findOne({ email });
    if (userFound) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const createdUser = await user.create({ firstName, lastName, email, password : hash });
    let token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
    res.status(200).json({ message: "Account created successfully", user: createdUser });
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const userFound = await user.findOne({ email });
    if (!userFound) {
        return res.status(400).json({ message: "Email or password is incorrect " });
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if(!isMatch)
    {
        return res.status(400).json({ message: "Email or password is incorrect " });
    }
    let token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    });
    res.status(200).json({message: "Logged in successfully!", userFound});
}

const handleLogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    });
    res.status(200).json({message: "Logged out successfully!"})
}

const handleGetUser =async (req, res) => {
    try{
        const email = req.user.email;
        const userInfo = await user.findOne({email});
        if(!userInfo){
            return res.status(404).json({message: "User not found"});
        }
         res.status(200).json({userDetails: {id:userInfo._id, firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email
            }
        });
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = { handleSignUp, handleLogin, handleLogout, handleGetUser};