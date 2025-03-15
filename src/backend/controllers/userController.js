import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

//Route for student login
const loginUser = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        //check if user exist in database
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({succuss: false, message: "User does not exist!"})
        }

        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({succuss: false, message: "Incorrect password!"})
        }

        //generate JWT token
        const token = createToken(user._id);
        res.status(200).json({succuss: true, message: "User logged in successfully!", token})
        
    } catch (error) {
        res.status(500).json({succuss: false, message: error.message})
    }
}

//Route for student registration
const registerUser = async (req, res) => {
    try {

        const { name, email, reg_num, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //check if user exist in database
        const userExists = await userModel.findOne({email});

        if(userExists){
            return res.status(400).json({succuss: false, message: "User already exists!"})
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({succuss: false, message: "Please enter a valid email"})
        }
        if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
            return res.status(400).json({succuss: false, message: "Please enter a strong password with at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol"})
        }

        //create new user
        const newUser = new userModel({
            name,
            email,
            reg_num,
            password: hashedPassword,
            isAdmin: false
        });

        const user = await newUser.save();

        //generate JWT token
        const token = createToken(user._id);
        res.status(201).json({succuss: true, message: "User registered successfully!", token})

    } catch (error) {
        console.log(error);
        res.status(500).json({succuss: false, message: error.message})
    }
}

//Route for Admin login
const loginAdmin = async (req, res) => {
}

//Route for Admin registration
const registerAdmin = async (req, res) => {
}

export { loginUser, registerUser, loginAdmin, registerAdmin };