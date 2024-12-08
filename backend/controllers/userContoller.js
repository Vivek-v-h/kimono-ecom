import validator from "validator";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Helper function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // JWT expiration time set to 7 days
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email." });
        }

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist." });
        }

        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create JWT token on successful authentication
            const token = createToken(user._id);
            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid password." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email." });
        }

        // Validate password strength
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long, include letters, numbers, and symbols." });
        }

        // Hash the password before saving to database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the new user in the database
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create JWT token after successful registration
        const token = createToken(user._id);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password match the admin credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Create a JWT token with an admin flag
            const token = jwt.sign(
                { email, isAdmin: true },  // Payload includes email and an isAdmin flag
                process.env.JWT_SECRET,   // Signing with JWT secret
                { expiresIn: '7d' }       // Token expiration set to 7 days
            );
            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

export { loginUser, registerUser, adminLogin };
