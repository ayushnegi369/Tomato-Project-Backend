import express from "express"; // Importing the Express framework for routing
import {
    addFood, // Importing the addFood controller function to add food items
    listFood, // Importing the listFood controller function to list food items
    removeFood, // Importing the removeFood controller function to remove food items
} from "../controllers/foodController.js"; // Importing the controller functions from foodController file

import multer from "multer"; // Importing multer for handling file uploads

// Creating a new router instance for handling food-related routes
const foodRouter = express.Router();

// Image Storage Engine configuration using multer
const storage = multer.diskStorage({
    // Destination where files will be saved
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Specify the folder 'uploads/' for saving files
    },
    // Filename generation for the uploaded file
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and the original file name
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Creating the upload instance with the defined storage configuration
const upload = multer({ storage: storage });

// Route to add a new food item
// The upload.single("image") middleware handles the file upload, expecting a field named 'image' in the request
foodRouter.post("/add", upload.single("image"), addFood);

// Route to list all food items
foodRouter.get("/list", listFood);

// Route to remove a food item by ID
foodRouter.post("/remove", removeFood);

// Exporting the food router for use in other parts of the application
export default foodRouter;
