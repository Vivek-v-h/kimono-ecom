import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Get the actual token value (remove "Bearer ")
        const token = authHeader.split(' ')[1];

        // Verify the token and decode it
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains the admin email and/or isAdmin flag
        if (token_decode.email !== process.env.ADMIN_EMAIL || !token_decode.isAdmin) {
            return res.status(403).json({ success: false, message: "Not Authorized. Login Again" });
        }

        // Proceed to the next middleware if authentication is successful
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred during authentication" });
    }
};

export default adminAuth;
