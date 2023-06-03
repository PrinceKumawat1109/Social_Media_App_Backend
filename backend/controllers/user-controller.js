const User = require('../model/User.js');
const bcrypt = require('bcryptjs');


const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    }
    catch (err) {
        console.log(err);
    }
    if(!users) {
        return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json({ users });
};

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }catch(err) {
        return console.log(err);
    }
    if(existingUser) {
        return res.status(422).json({message: "User already exists"});
    }
    
    const hashedPassword = bcrypt.hashSync(password);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        blogs: [],
    });
    try {
        await newUser.save();
    }catch(err) {
        return console.log(err);
    }
    return res.status(201).json({ newUser });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }catch(err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({message: "User does not exist"});
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    if(!isValidPassword) {
        return res.status(401).json({message: "Invalid password"});
    }
    return res.status(200).json({message: "Login successful"});
};

exports.getAllUser = getAllUser;
exports.signup = signup;
exports.login = login;