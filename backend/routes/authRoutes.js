import express from "express";
const AuthRoutes = express.Router();
import { signin, signup } from "../controllers/userController.js";

AuthRoutes.post("/signup", signup);
AuthRoutes.post("/signin", signin);

export default AuthRoutes;
