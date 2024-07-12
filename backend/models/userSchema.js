import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide Your name"],
    minLength: [3, "Name Must Contain at least 3 characters"],
    maxLength: [30, "Name can not Contain above 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Provide Your Email!"],
    validate: [validator.isEmail, "Please Provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Provide your password"],
    minLength: [6, "Password Must Contain at least 6 characters"],
    maxLength: [33, "Password can not Contain above 32 characters"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please Provide your role"],
    enum: ["Admin", "Client"],
    // default: "Client",
  },
  company: {
    type: String,
    required: [true, "Please provide Your Company name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generating a JWT token for authorization
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
export const User = mongoose.model("User", userSchema);
