import foodModel from "../models/foodModel.js"; // Import the food model for database operations
import fs from "fs"; // Import the fs module to handle file system operations

// Add a new food item to the database
const addFood = async (req, res) => {
    // Extract the filename of the uploaded image from the request
    let image_filename = `${req.file.filename}`;

    // Create a new food document using the food model
    const food = new foodModel({
        name: req.body.name, // Set the food name from the request body
        description: req.body.description, // Set the food description from the request body
        price: req.body.price, // Set the food price from the request body
        category: req.body.category, // Set the food category from the request body
        image: image_filename, // Store the image filename in the food document
    });

    try {
        // Save the food document to the database
        await food.save();
        // Respond with success message
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        // Log the error and respond with failure message
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Retrieve all food items from the database
const listFood = async (req, res) => {
    try {
        // Find all food documents in the database
        const foods = await foodModel.find({});
        // Respond with success and the list of food items
        res.json({ success: true, data: foods });
    } catch (error) {
        // Log the error and respond with failure message
        console.log(error);
        res.json({ success: false, message: error });
    }
};

// Remove a food item from the database
const removeFood = async (req, res) => {
    try {
        // Find the food item by its ID from the request body
        const food = await foodModel.findById(req.body.id);

        // Delete the associated image file from the uploads directory
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error removing image file:", err); // Log error if file deletion fails
            }
        });

        // Delete the food document from the database
        await foodModel.findByIdAndDelete(req.body.id);

        // Respond with success message
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        // Log the error and respond with failure message
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Export the functions for use in routes
export { addFood, listFood, removeFood };
