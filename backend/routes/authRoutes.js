import express from "express";
const AuthRoutes = express.Router();
import { mine, signin, signup } from "../controllers/userController.js";
import authenticate from "../middleware/authMiddleware.js";

AuthRoutes.post("/signup", signup);
AuthRoutes.post("/signin", signin);
AuthRoutes.get("/me", authenticate, mine);

export default AuthRoutes;
