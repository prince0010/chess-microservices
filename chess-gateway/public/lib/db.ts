import mongoose from "mongoose"
import "@/lib/jobs"

const URI = process.env.MONGO_URI

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return // Already connected
  if (!URI)
    throw new Error("Invalid MongoDB Connection. Please check your .env file.")

  try {
    await mongoose.connect(URI, {
      dbName: "wechess",
      appName: "wechess",
    })
    console.log("💻 Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}
