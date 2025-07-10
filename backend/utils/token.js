import jwt from "jsonwebtoken";
import { compare,hash,genSalt } from "bcrypt";

const tokenGen = (user, key) => {
  const token = jwt.sign({ id: user._id, email: user.email }, key, { expiresIn: "7d" });
  return token;
};
const hashPassword = async (password) => {
    const salt = await genSalt(10)
    const hashed = await hash(password,salt)
    return hashed
}
const comparePassword = async(plainPassword,hashedPassword)=>{
return await compare(plainPassword,hashedPassword)
}

const sendResponse = (res,statusCode,message)=>{
  return res.status(statusCode).json({message})
}
export { sendResponse,tokenGen, hashPassword,comparePassword };
