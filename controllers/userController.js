import userModel from "../models/userModel.js"; // Import the user model for database operations
import jwt from "jsonwebtoken"; // Import jsonwebtoken for creating tokens
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import validator from "validator"; // Import validator for input validation

// Function to log in a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        // Find user by email in the database
        const user = await userModel.findOne({ email });
        // Always use the same response for invalid credentials to prevent user enumeration
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        // Create a JWT token for the authenticated user
        const token = createToken(user._id);
        // Respond with success, token, and user info (excluding password)
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// Function to create a JWT token
const createToken = (id) => {
    const secret = process.env.JWT_SECRET || "dev_secret";
    return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

// Function to register a new user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required." });
        }
        // Check if a user with the same email already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(409).json({ success: false, message: "User already exists." });
        }
        // Validate the email format and ensure the password is strong
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email." });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
        }
        // Hash the user's password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user document
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });
        // Save the new user to the database
        const user = await newUser.save();
        // Create a JWT token for the newly registered user
        const token = createToken(user._id);
        // Respond with success, token, and user info (excluding password)
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// Export the login and registration functions for use in routes
export { loginUser, registerUser };
