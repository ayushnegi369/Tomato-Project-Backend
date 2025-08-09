import express from "express"; // Importing the express framework for building the server
import cors from "cors"; // Importing the CORS middleware to enable Cross-Origin Resource Sharing
import { connectDB } from "./config/db.js"; // Importing the database connection function
import foodRouter from "./routes/foodRoute.js"; // Importing routes for food-related API endpoints
import userRouter from "./routes/userRoute.js"; // Importing routes for user-related API endpoints
import dotenv from "dotenv"; // Load env variables from .env
import cartRouter from "./routes/cartRoute.js"; // Importing routes for cart-related API endpoints
import orderRouter from "./routes/orderRoute.js"; // Importing routes for order-related API endpoints
import path from "path";
import { fileURLToPath } from "url";

// Initialize dotenv before accessing process.env, using path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Application configuration
const app = express(); // Create an Express app
const port = process.env.PORT || 4000; // Support dynamic port for hosting platforms

// Middleware configuration
app.use(express.json()); // Middleware to parse incoming JSON requests
// Configure CORS for separate frontend/backend hosting
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://tomato-frontend-git-main-ayushnegi369s-projects.vercel.app",
];
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((s) => s.trim())
  : defaultOrigins; // default for local dev and deployed Vercel URL

// Allow common preview deploy subdomains on Vercel (pattern-based)
const allowedOriginPatterns = [
  /^https?:\/\/localhost:(5173|5174)$/,
  /^https:\/\/tomato-frontend-[a-z0-9-]+-ayushnegi369s-projects\.vercel\.app$/i,
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (allowedOriginPatterns.some((re) => re.test(origin))) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: false,
  })
); // Middleware to enable CORS (Cross-Origin Resource Sharing)

// Database connection
connectDB(); // Connect to MongoDB using the `connectDB` function

// API routes and static file serving
app.use("/api/food", foodRouter); // Route for handling food-related API requests
app.use("/images", express.static("uploads")); // Serve static files (images) from the 'uploads' directory
app.use("/api/user", userRouter); // Route for handling user-related API requests
app.use("/api/cart", cartRouter); // Route for handling cart-related API requests
app.use("/api/order/", orderRouter); // Route for handling order-related API requests

// Root endpoint to check if the API is working
app.get("/", (req, res) => {
    res.send("API WORKING"); // Send a simple response when accessing the root URL
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${port}`); // Log the server URL once it starts
});

/* MongoDB connection string example (replace placeholders):
   mongodb+srv://<db_username>:<db_password>@cluster0.as43i97.mongodb.net/?
   
   Make sure to replace <db_username> and <db_password> with your actual MongoDB credentials.
   The connection string will be used in the `connectDB` function (typically in the `config/db.js` file).
*/
