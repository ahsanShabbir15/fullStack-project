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
    return res.status(200).json({
      token,
    });
    res.cookies
  } catch (error) {
    console.log("signin error", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export { signin, signup };
