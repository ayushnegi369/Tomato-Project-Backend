import mongoose from "mongoose"; // Import the mongoose library to interact with MongoDB

// Function to connect to MongoDB using mongoose
export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("DB Connection Failed: MONGO_URI is not set in environment variables");
        throw new Error("MONGO_URI not configured");
    }
    await mongoose
        .connect(mongoUri)
        // If the connection is successful, log "DB Connected" to the console
        .then(() => {
            console.log("DB Connected");
        })
        // Optional: Add a .catch() to handle any connection errors (commented out for simplicity)
        .catch((error) => {
            console.error("DB Connection Failed:", error); // Log the error if the connection fails
        });
};
