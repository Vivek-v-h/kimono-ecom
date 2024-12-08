import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    // Get token from Authorization header, expecting "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1]; // Get token after "Bearer"

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        // Verify the token using the JWT secret
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Add the decoded user ID to the request object
        req.userId = token_decode.id;  // Use req.userId to store the user's ID

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Handle token expiration
            return res.status(401).json({ success: false, message: "Token expired. Please login again" });
        }
        // Handle other JWT errors
        console.error(error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authUser;
