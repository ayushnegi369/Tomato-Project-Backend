import express from "express"; // Importing the Express framework for routing
import authMiddleware from "../middleware/auth.js"; // Importing the authentication middleware
import { createRazorpayOrder, verifyRazorpayPayment, placeOrder, getUserOrders } from "../controllers/orderController.js"; // Importing the placeOrder controller function

// Creating a new router instance for handling order-related routes
const orderRouter = express.Router();

// Route to place an order
// The authMiddleware checks if the user is authenticated before allowing them to place an order
orderRouter.post("/place", authMiddleware, placeOrder);
// Route to create a Razorpay order
orderRouter.post("/razorpay/order", authMiddleware, createRazorpayOrder);
// Route to verify Razorpay payment and save order
orderRouter.post("/razorpay/verify", authMiddleware, verifyRazorpayPayment);
// Route to get all orders for the authenticated user
orderRouter.post("/user-orders", authMiddleware, getUserOrders);

// Exporting the order router for use in other parts of the application
export default orderRouter;
