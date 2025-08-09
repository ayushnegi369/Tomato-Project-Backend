import orderModel from "../models/orderModel.js"; // Importing the order model
import userModel from "../models/userModel.js"; // Importing the user model
import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config";

// Lazily initialize Razorpay so the app can start without keys in non-payment flows
const getRazorpay = () => {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay credentials not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)");
    }
    return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;
        if (!amount) return res.status(400).json({ success: false, message: "Amount is required" });
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: `receipt_order_${Date.now()}`,
        };
        const order = await getRazorpay().orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Could not create Razorpay order" });
    }
};

// Verify Razorpay payment and save order
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, amount, address } = req.body;
        const userId = req.body.userId;
        // Log all incoming values
        console.log("--- Razorpay Payment Verification Debug ---");
        console.log("razorpay_order_id:", razorpay_order_id);
        console.log("razorpay_payment_id:", razorpay_payment_id);
        console.log("razorpay_signature:", razorpay_signature);
        console.log("userId (from auth middleware):", userId);
        console.log("items:", items);
        console.log("amount:", amount);
        console.log("address:", address);
        // Do not log secrets
        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpaySecret) {
            return res.status(500).json({ success: false, message: "Payment verification unavailable: RAZORPAY_KEY_SECRET not configured" });
        }
        const expectedSignature = crypto.createHmac("sha256", razorpaySecret)
            .update(sign)
            .digest("hex");
        console.log("expectedSignature:", expectedSignature);
        if (expectedSignature !== razorpay_signature) {
            console.log("Signature mismatch!");
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
        // Save order only if payment is verified
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: true
        });
        await newOrder.save();
        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        console.log("Order placed successfully!");
        res.status(201).json({ success: true, message: "Payment verified and order placed" });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

// Function to place an order, triggered by a request from the frontend
const placeOrder = async (req, res) => {
    // Frontend URL for redirect after payment success/failure
    const frontend_url = "http://localhost:5173"; // Change this to your deployed frontend URL in production

    try {
        // 1. Creating a new order object with data from the request body
        const newOrder = new orderModel({
            userId: req.body.userId, // User ID from the request body
            items: req.body.items, // List of items to order
            amount: req.body.amount, // Total order amount
            address: req.body.address, // Delivery address for the order
        });

        // 2. Save the new order to the database
        await newOrder.save();

        // 3. Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // 4. Prepare line items for Stripe Checkout
        // Map each item in the order to the format expected by Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd", // Set currency to INR (Indian Rupees)
                product_data: {
                    name: item.name, // Name of the product
                },
                unit_amount: item.price * 100 * 80, // Convert the price to paise (assuming 1 INR = 80 units)
            },
            quantity: item.quantity, // Quantity of the item
        }));

        // 5. Add delivery charges as a separate line item
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges", // Description for the delivery charges
                },
                unit_amount: 2 * 100 * 80, // Fixed delivery charge (example: Rs 2 converted to paise)
                quantity: 1, // Only 1 delivery charge is added per order
            },
        });

        // 6. Create a Stripe Checkout session
        // const session = await stripe.checkout.sessions.create({
        //     line_items: line_items, // Add the line items to the Stripe session
        //     mode: "payment", // Payment mode for processing the order
        //     // Define success and cancel URLs to handle redirection after payment
        //     success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`, // Redirect on successful payment
        //     cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`, // Redirect if the payment fails or is canceled
        // });

        // 7. Send the Stripe session URL back to the frontend
        // res.json({ success: true, session_url: session.url });
        res.json({ success: true, message: "Order placed successfully (Stripe integration pending)" });
    } catch (error) {
        // Log the error and return a response with an error message
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID required" });
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Could not fetch orders" });
    }
};

export { createRazorpayOrder, verifyRazorpayPayment, placeOrder, getUserOrders };
