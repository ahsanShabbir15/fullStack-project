import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/token.js";
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token,"token");

  if (!token) {
    return sendResponse(res, 401, "unauthorized");
  }
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, "invalid token");
  }
};
export default authenticate;
