import User from "../models/user.js";
import signupValidation from "../validations/signupValidation.js";
import signinValidation from "../validations/signinValidation.js";
import {
  hashPassword,
  comparePassword,
  tokenGen,
  sendResponse,
} from "../utils/token.js";

const signup = async (req, res) => {
  try {
    await signupValidation.validate(req.body);
    const { name, email, password, confirmPassword } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return sendResponse(res, 409, "user already exist");
    }
    if (password !== confirmPassword) {
      return sendResponse(res, 400, "Passwords do not match");
    }
    const hashed = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashed,
    });
    await user.save();
    return sendResponse(res, 201, "user created successfully");
  } catch (error) {
    if (error.name === "validationError") {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    console.log("signup error", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const signin = async (req, res) => {
  try {
    await signinValidation.validate(req.body);
    const { email, password } = req.body;

    const isExist = await User.findOne({ email });
    if (!isExist) {
      return sendResponse(res, 404, "user not found");
    }
    const matchPassword = await comparePassword(password, isExist.password);
    if (!matchPassword) {
      return sendResponse(res, 401, "invalid credentials");
    }
    const token = tokenGen(isExist, process.env.KEY);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        token,
      });
  } catch (error) {
    console.log("signin error", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const mine = async (req, res) => {
  try {
    console.log("Decoded token:", req.user);
    const user = await User.findById(req.user.id).select("email role");
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in /me route:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
export { signin, signup, mine };
