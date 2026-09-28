import mongoose from "mongoose";

async function connectDB() {
    try {
        const connectionInstance= await mongoose.connect(process.env.DB_URL)
        
        console.log("Database connected Successfully", connectionInstance.connection.host);
    } catch (error) {
        console.error("Database connection error",error.message);
        process.exit(1);
        
    }
}

export default connectDB;