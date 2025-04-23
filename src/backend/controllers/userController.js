import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import projectModel from '../models/projectModel.js';

const createToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Controller for getting user data
const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id, 'name email isAdmin reg_num isAccountVerified');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isAdmin) {
            res.status(200).json({ success: true, adminData: { _id: user._id, name: user.name, email: user.email, reg_num: user.reg_num, isAdmin: user.isAdmin, isAccountVerified: user.isAccountVerified } });
        } else {
            res.status(200).json({ success: true, userData: { _id: user._id, name: user.name, email: user.email, reg_num: user.reg_num, isAccountVerified: user.isAccountVerified } });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Controller for getting user data by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }
        const user = await userModel.findById(userId).select("name email reg_num");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, userData: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getStudentProjectDetails = async (req, res) => {
    try {
        // Optionally filter by projectId if provided
        const { projectId } = req.query;
        let projects;
        if (projectId) {
            projects = await projectModel.find({ _id: projectId });
        } else {
            projects = await projectModel.find({});
        }

        // Collect all student ObjectIds from all projects
        let allStudentIds = [];
        projects.forEach(project => {
            if (Array.isArray(project.students)) {
                allStudentIds = allStudentIds.concat(project.students.map(id => id.toString()));
            }
        });

        // Remove duplicates
        allStudentIds = [...new Set(allStudentIds)];

        if (allStudentIds.length === 0) {
            return res.status(200).json({ success: true, students: [] });
        }

        // Fetch user details for all student ids
        const users = await userModel.find({ _id: { $in: allStudentIds } }, 'name email');
        // Map to desired output
        const students = users.map(u => ({ name: u.name, email: u.email }));

        return res.status(200).json({ success: true, students });
    } catch (error) {
        console.error("Error in getStudentProjectDetails:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//Controller for student login
const loginUser = async (req, res) => {
    try {

        const { name, reg_num, password } = req.body;

        const user = await userModel.findOne({ reg_num });

        if (!user || user.isAdmin) {
            return res.status(400).json({ success: false, message: "User does not exist!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password!" })
        }

        //JWT token
        const token = createToken(user._id, user.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
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

        res.status(200).json({ success: true, message: "User logged in successfully!", token })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//Controller for student registration
const registerUser = async (req, res) => {
    try {

        const { name, email, reg_num, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists!" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ success: false, message: "Please enter a strong password with at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol" })
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
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Trackify 🚀",
            text: "Thank you for registering with Trackify. We are glad to have you on board!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome to <span style="color:#2196F3;">Trackify</span>!</h2>
                    <p>Hi there,</p>
                    <p>Thank you for registering with <strong>Trackify</strong>. We're thrilled to have you on board!</p>
                    <p>Start tracking your projects and progress efficiently with our platform.</p>
                    <br>
                    <p>Best regards,<br>The Trackify Team</p>
                </div>
            `
        };


        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "User registered successfully!", token })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

//Controller for Admin login
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
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        })

        res.status(200).json({ success: true, message: "Admin logged in successfully!", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Controller for Admin registration
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
                    "Please enter a strong password with at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol",
            });
        }

        const lastAdmin = await userModel.findOne({ isAdmin: true }).sort({ reg_num: -1 });

        let newRegNum = "admin_1";

        if (lastAdmin && lastAdmin.reg_num) {
            const lastRegNum = lastAdmin.reg_num;
            const lastNumber = parseInt(lastRegNum.split('_')[1]);
            newRegNum = `admin_${lastNumber + 1}`;
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
            reg_num: newRegNum,
        });

        const admin = await newAdmin.save();

        const token = createToken(admin._id, admin.isAdmin);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Trackify 🚀",
            text: "Thank you for registering with Trackify. We are glad to have you on board!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4CAF50;">Welcome to <span style="color:#2196F3;">Trackify</span>!</h2>
                    <p>Hi there,</p>
                    <p>Thank you for registering with <strong>Trackify</strong>. We're thrilled to have you on board!</p>
                    <p>Start tracking your projects and progress efficiently with our platform.</p>
                    <br>
                    <p>Best regards,<br>The Trackify Team</p>
                </div>
            `
        };


        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Controller for user logout
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.status(200).json({ success: true, message: "User logged out successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Controller for send verify otp
const sendVerifyOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified!" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpired = Date.now() + 300000; // 5 minutes

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your verification OTP is ${otp}. Verify your account using this OTP code within 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
                    <h2 style="color: #4CAF50;">Verify Your Account</h2>
                    <p>Hello <strong>${user.name || ''}</strong>,</p>
                    <p>Use the following OTP to verify your account:</p>
                    <div style="font-size: 24px; font-weight: bold; background: #e0f7fa; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                    <br>
                    <p>Thanks,<br>The Trackify Team</p>
                </div>
            `
        };


        await transporter.sendMail(mailOption);

        res.status(200).json({ success: true, message: `Verification OTP sent successfully to Email: ${user.email}` });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Controller to verify email
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Please provide email and OTP" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist!" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified!" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" });
        }

        if (Date.now() > user.verifyOtpExpire) {
            return res.status(400).json({ success: false, message: "OTP expired!" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verified ✅",
            text: `Your account has been verified successfully!`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0fdf4; color: #1e4620;">
                    <h2 style="color: #16a34a;">🎉 Account Verified Successfully!</h2>
                    <p>Hello <strong>${user.name || ''}</strong>,</p>
                    <p>We're happy to let you know that your account has been <strong>successfully verified</strong>.</p>
                    <p>You can now access all the features of <strong>Trackify</strong> and start managing your projects more efficiently.</p>
                    <br>
                    <p>If you did not perform this action, please contact our support immediately.</p>
                    <br>
                    <p>Welcome aboard!<br>— The Trackify Team</p>
                </div>
            `
        };


        await transporter.sendMail(mailOption);

        res.status(200).json({ success: true, message: "Account verified successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//Connection to check if user is authenticated or not
const isAuthenticated = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id, 'name email isAdmin reg_num isAccountVerified');
        if (!user) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                reg_num: user.reg_num,
                isAdmin: user.isAdmin,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Controller to send password reset OTP
const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpired = Date.now() + 300000; //5 minutes

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your Password Reset OTP is ${otp}. Reset your password using this OTP code within 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9ff; color: #333;">
                    <h2 style="color: #3b82f6;">🔐 Password Reset Request</h2>
                    <p>Hello <strong>${user.name || ''}</strong>,</p>
                    <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
                    <div style="font-size: 24px; font-weight: bold; background: #e0f2fe; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <p>If you did not request a password reset, please ignore this email or contact support.</p>
                    <br>
                    <p>Stay secure,<br>The Trackify Team</p>
                </div>
            `
        };


        await transporter.sendMail(mailOption);

        return res.status(200).json({ success: true, message: `Password Reset OTP sent successfully! on Email: ${user.email}` });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

//Controller to reset password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields i.e Email, OTP and New Password' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP!' });
        }

        if (Date.now() > user.resetOtpExpired) {
            return res.status(400).json({ success: false, message: 'OTP expired!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpired = 0;

        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully!' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { getUser, getUserById, getStudentProjectDetails, loginUser, registerUser, loginAdmin, registerAdmin, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword };