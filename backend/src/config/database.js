import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set. Check that the project .env file is loaded.");
    }

    const connectionInstance = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
};
export default connectDB;