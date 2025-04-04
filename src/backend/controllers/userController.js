import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

const createToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Route for student login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || user.isAdmin) {
            return res.status(400).json({ succuss: false, message: "User does not exist!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ succuss: false, message: "Incorrect password!" })
        }

        //JWT token
        const token = createToken(user._id, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        //Sending welcome email
        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: email,
        //     subject: "Welcome to Trackify",
        //     text: "Thank you for registering with Trackify. We are glad to have you on board!",
        // };

        // await transporter.sendMail(mailOptions);

        res.status(200).json({ succuss: true, message: "User logged in successfully!", token })

    } catch (error) {
        res.status(500).json({ succuss: false, message: error.message })
    }
}

//Route for student registration
const registerUser = async (req, res) => {
    try {

        const { name, email, reg_num, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ succuss: false, message: "User already exists!" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ succuss: false, message: "Please enter a valid email" })
        }
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ succuss: false, message: "Please enter a strong password with at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol" })
        }

        const newUser = new userModel({
            name,
            email,
            reg_num,
            password: hashedPassword,
            isAdmin: false
        });

        const user = await newUser.save();

        const token = createToken(user._id, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Trackify",
            text: "Thank you for registering with Trackify. We are glad to have you on board!",
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ succuss: true, message: "User registered successfully!", token })

    } catch (error) {
        console.log(error);
        res.status(500).json({ succuss: false, message: error.message })
    }
}

//Route for Admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await userModel.findOne({ email });

        if (!admin || !admin.isAdmin) {
            return res.status(400).json({ success: false, message: "Admin does not exist!" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password!" });
        }

        const token = createToken(admin._id, admin.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        res.status(200).json({ success: true, message: "Admin logged in successfully!", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a strong password with at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol",
            });
        }

        const adminExists = await userModel.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ success: false, message: "Admin already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            isAdmin: true,
            reg_num: null,
        });

        const admin = await newAdmin.save();

        const token = createToken(admin._id, admin.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Trackify",
            // text: "Thank you for registering with Trackify. We are glad to have you on board!",
            html: '<h1>Thank you for registering with Trackify.</h1><p>We are glad to have you on our universe</p>'
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "admin created successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
        })

        return res.status(200).json({ success: true, message: "User logged out successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, loginAdmin, registerAdmin, logout };