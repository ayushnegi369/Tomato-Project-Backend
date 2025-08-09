import express from "express"; // Importing the Express framework to create the router
import { loginUser, registerUser } from "../controllers/userController.js"; // Importing user authentication controller functions

// Creating a new router instance for handling user-related routes
const userRouter = express.Router();

// Route for user registration
userRouter.post("/register", registerUser); // Calls the registerUser function when a POST request is made to /register

// Route for user login
userRouter.post("/login", loginUser); // Calls the loginUser function when a POST request is made to /login

// Exporting the user router for use in other parts of the application
export default userRouter;
