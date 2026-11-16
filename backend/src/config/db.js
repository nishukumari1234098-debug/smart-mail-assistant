import mongoose from "mongoose"

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Atlas connected successfully")
    } catch(err){
        console.error("MongoDb connection failed:", err.message)
        process.exit(1)
    }
}

export default connectDB