import { catchAsyncError } from "./cathAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Authentication
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not Authenticated", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

// Authorization
// ...roles == not multiple role
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
