// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Local modules
import dbConnect from "./db.js";
import AuthRoutes from "./routes/authRoutes.js";

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to Database
dbConnect();
app.use("/api", AuthRoutes); // <-- Mount your auth routes here

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
