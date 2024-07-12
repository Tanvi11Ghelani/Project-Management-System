import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const url = process.env.MONGO_URI || " ";

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully🙂🙂🙂");
  } catch (error) {
    console.error("Database Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
