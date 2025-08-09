import express from "express"; // Importing the express library for building the router
import {
    addToCart, // Importing the addToCart controller function
    removeFromCart, // Importing the removeFromCart controller function
    getCart, // Importing the getCart controller function
} from "../controllers/cartController.js"; // Importing controller functions from the cartController file

import authMiddleware from "../middleware/auth.js"; // Importing authentication middleware to protect routes

// Creating a new router instance for handling cart-related routes
const cartRouter = express.Router();

// Route to add an item to the cart
// Uses the authMiddleware to ensure the user is authenticated
cartRouter.post("/add", authMiddleware, addToCart);

// Route to remove an item from the cart
// Uses the authMiddleware to ensure the user is authenticated
cartRouter.post("/remove", authMiddleware, removeFromCart);

// Route to get the user's cart data
// Uses the authMiddleware to ensure the user is authenticated
cartRouter.post("/get", authMiddleware, getCart);

// Exporting the cart router for use in other parts of the application
export default cartRouter;
