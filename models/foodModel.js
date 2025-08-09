import mongoose from "mongoose"; // Import mongoose library for MongoDB object modeling

// Define the schema for the food items
const foodSchema = new mongoose.Schema({
    name: {
        type: String, // Name of the food item
        required: true, // Name is a required field
    },
    description: {
        type: String, // Description of the food item
        required: true, // Description is a required field
    },
    price: {
        type: Number, // Price of the food item
        required: true, // Price is a required field
    },
    image: {
        type: String, // Image filename or URL of the food item
        required: true, // Image is a required field
    },
    category: {
        type: String, // Category of the food item (e.g., appetizer, main course)
        required: true, // Category is a required field
    },
});

// Check if the food model already exists in the mongoose models
// If it exists, use that model; if not, create a new food model using the defined schema
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

// Export the food model for use in other parts of the application
export default foodModel;
