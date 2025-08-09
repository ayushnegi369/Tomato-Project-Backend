import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for token handling

// Middleware function to authenticate users based on JWT
const authMiddleware = async (req, res, next) => {
    // Extract the token from the request headers
    const { token } = req.headers;

    // Check if a token is provided; if not, respond with an unauthorized message
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again", // Message indicating the user needs to log in
        });
    }

    try {
        // Verify the token using the secret key from the environment variables
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

        // If the token is valid, attach the user ID from the token payload to the request body
        req.body.userId = token_decode.id;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.log(error); // Log any error that occurs during token verification
        // Respond with an error message if token verification fails
        res.json({ success: false, message: "Error" });
    }
};

// Export the authentication middleware for use in other parts of the application
export default authMiddleware;
