import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Database and Cloudinary connections with error handling
connectDB().catch((error) => {
  console.error("Database connection error:", error);
  process.exit(1); // Exit process if connection fails
});

connectCloudinary().catch((error) => {
  console.error("Cloudinary connection error:", error);
  process.exit(1); // Exit process if connection fails
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://medicure-frontend-elvv.onrender.com","https://medicure-admin.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization","atoken"],
  })
);

// API endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Fallback route for handling 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`App is Running on ${port}`);
});
