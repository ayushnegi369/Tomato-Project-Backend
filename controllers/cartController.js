import userModel from "../models/userModel.js";

// Add item to user cart
const addToCart = async (req, res) => {
    try {
        // Fetch the user data by userId passed in the request body
        let userData = await userModel.findById(req.body.userId);

        // Check if the user exists in the database
        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Get the user's cart data (if not present, initialize it as an empty object)
        let cartData = userData.cartData || {};

        // If the item is not in the cart, set the quantity to 1; otherwise, increment the quantity
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        // Update the user's cart in the database with the new cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        // Respond to the client with a success message
        return res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        // Log any server error for debugging purposes
        console.log(error);

        // Respond to the client with a server error message
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("Request Body:", req.body);

        // Fetch the user data by userId from the request body
        let userData = await userModel.findById(req.body.userId);

        // Check if the user exists in the database
        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Access the user's cart data (initialize it as an empty object if undefined)
        let cartData = userData.cartData || {};

        // Log current cart data for debugging
        console.log("User Cart Data:", cartData);

        // Check if the item exists in the cart and its quantity is greater than 0
        if (cartData.hasOwnProperty(req.body.itemId)) {
            if (cartData[req.body.itemId] > 0) {
                // Decrease the quantity of the item in the cart
                cartData[req.body.itemId] -= 1;

                // If the item quantity becomes 0, remove it from the cart
                if (cartData[req.body.itemId] === 0) {
                    delete cartData[req.body.itemId];
                    console.log(`Item ${req.body.itemId} removed from cart`);
                }

                // Update the user's cart data in the database
                await userModel.findByIdAndUpdate(req.body.userId, {
                    cartData,
                });

                // Respond with a success message to the client
                return res.json({
                    success: true,
                    message: "Item removed from cart",
                });
            }
        }

        // If the item is not in the cart or its quantity is already zero
        return res.status(400).json({
            success: false,
            message: "Item not in cart or quantity is already zero",
        });
    } catch (error) {
        // Log any errors for debugging
        console.error("Error in removeFromCart:", error);

        // Respond with a server error message
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        // Fetch the user data by userId passed in the request body
        let userData = await userModel.findById(req.body.userId);

        // Check if the user exists in the database
        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Access the user's cart data (initialize it as an empty object if undefined)
        let cartData = userData.cartData || {};

        // Respond with the current cart data
        return res.json({ success: true, cartData });
    } catch (error) {
        // Log any errors for debugging
        console.log(error);

        // Respond with a server error message
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
};

export { addToCart, removeFromCart, getCart };
