// cartController.js

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// Add product to user's cart


const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user._id;  // Get userId from the authenticated user

        // Validate size
        if (!size) {
            return res.status(400).json({ success: false, message: 'Size is required' });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const cartData = userData.cartData || {};

        // Check if the item already exists in the cart
        if (cartData[itemId]?.[size]) {
            cartData[itemId][size] += 1;  // Increment quantity if size already exists
        } else {
            // Add the item and size to the cart
            cartData[itemId] = { ...cartData[itemId], [size]: 1 };
        }

        // Save the updated cartData to the database
        await userModel.findByIdAndUpdate(userId, { cartData });

        // Return the updated cart data
        res.json({ success: true, message: 'Added to Cart', cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




// Update product quantity in cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        // Validate quantity
        if (quantity < 1) {
            return res.json({ success: false, message: 'Quantity must be at least 1' });
        }

        if (!size) {
            return res.json({ success: false, message: 'Size is required' });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData;

        // Check if the item and size exist in the cart
        if (cartData?.[itemId]?.[size]) {
            cartData[itemId][size] = quantity; // Update the quantity
        } else {
            return res.json({ success: false, message: 'Item not found in cart' });
        }

        // Save the updated cart data to the database
        await userModel.findByIdAndUpdate(userId, { cartData });

        // Return the updated cart data
        res.json({ success: true, message: 'Cart updated successfully', cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers['authorization']?.split(' ')[1]; // Get token after "Bearer"
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token is required' });
        }

        // Verify token and decode user ID
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY); // Verify token using secret key
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        const { userId } = decoded; // Get userId from the decoded token
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is missing in the token' });
        }

        // Retrieve user data from the database
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Retrieve cart data from the user's database entry
        let cartData = userData.cartData || {}; // If cart data is missing, initialize as empty object

        // Return cart data, even if it's empty
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
