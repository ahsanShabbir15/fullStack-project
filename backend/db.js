import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const dbConnect = async ()=>{
    try {
        await  mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB');
        
    } catch (error) {
            console.error('❌ MongoDB connection error:', error);

    }
}
export default dbConnect