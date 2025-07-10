import User from "../models/user.js";
import {
  hashPassword,
  comparePassword,
  tokenGen,
  sendResponse,
} from "../utils/token.js";

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
      //   return res.status(409).json({ message: "user already exist" });
      return sendResponse(res, 409, "user already exist");
    }
    const hashed = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashed,
    });
    await user.save();
    // res.status(201).json({ message: "user created successfully" });
    return sendResponse(res, 201, "user created successfully");
  } catch (error) {
    console.log("signup error", error);
    // res.status(500).json({ message: "Server error" });
    return sendResponse(res, 500, "Internal server error");
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }
    const isExist = await User.findOne({ email });
    if (!isExist) {
      // return res.status(404).json({message:'user not found'})
      return sendResponse(res, 404, "user not found");
    }
    const matchPassword = await comparePassword(password, isExist.password);
    if (!matchPassword) {
      return sendResponse(res, 401, "invalid credentials");
    }
    const token = tokenGen(isExist, process.env.KEY);
    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.log("signin error", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export { signin, signup };
