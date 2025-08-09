import mongoose from "mongoose"; // Import mongoose library for MongoDB object modeling

// Define the schema for orders
const orderSchema = new mongoose.Schema({
    userId: {
        type: String, // Unique identifier for the user who placed the order
        required: true, // User ID is a required field
    },
    items: {
        type: Array, // Array to hold the items included in the order
        required: true, // Items are a required field
    },
    amount: {
        type: Number, // Total amount for the order
        required: true, // Amount is a required field
    },
    address: {
        type: Object, // Object to hold address details for the order
        required: true, // Address is a required field
    },
    status: {
        type: String, // Status of the order (e.g., "Food Processing", "Shipped")
        default: "Food Processing", // Default status is "Food Processing"
    },
    date: {
        type: Date, // Date when the order was placed
        default: Date.now(), // Default to the current date and time
    },
    payment: {
        type: Boolean, // Indicates whether the payment has been completed
        default: false, // Default payment status is false (not paid)
    },
});

// Check if the order model already exists in the mongoose models
// If it exists, use that model; if not, create a new order model using the defined schema
const orderModel =
    mongoose.models.order || mongoose.model("order", orderSchema);

// Export the order model for use in other parts of the application
export default orderModel;
