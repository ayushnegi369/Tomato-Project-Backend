import mongoose, { mongo } from "mongoose"; // Import mongoose library for MongoDB object modeling

// Define the schema for users
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, // User's name
            required: true, // Name is a required field
        },
        email: {
            type: String, // User's email address
            required: true, // Email is a required field
            unique: true, // Email must be unique across users
        },
        password: {
            type: String, // User's password (should be hashed)
            required: true, // Password is a required field
        },
        cartData: {
            type: Object, // Object to hold user's cart data (item IDs and quantities)
            default: {}, // Default value is an empty object
        },
    },
    { minimize: false } // Allows storing empty objects in the database without removing them
);

// Check if the user model already exists in the mongoose models
// If it exists, use that model; if not, create a new user model using the defined schema
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

// Export the user model for use in other parts of the application
export default userModel;
