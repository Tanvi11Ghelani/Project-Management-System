import { catchAsyncError } from "../middlewares/cathAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, role, password, company } = req.body;

  if (!name || !email || !role || !password || !company) {
    return next(
      new ErrorHandler("Please provide all details for registration!", 400)
    );
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already registered!", 400));
  }

  // If not exist, then create user
  user = await User.create({
    name,
    email,
    role,
    password,
    company,
  });

  //   res.status(200).json({
  //     success: true,
  //     message: "User Registered",
  //   });
  sendToken(user, 200, res, "User Registered Successfully!");
});

//login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please fill all the details for login"));
  }

  // Email check
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  // Password check
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  // Role check
  if (user.role !== role) {
    return next(new ErrorHandler(`User with role ${role} not found!`, 400));
  }

  //   res.status(200).json({
  //     success: true,
  //     message: "User Logged in successfully",
  //   });
  // All checks passed successfully
  sendToken(user, 200, res, "User Logged in Successfully");
});

//logout
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });
});

//GET USER
export const getUser = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

//get the client
export const getClient = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(new ErrorHandler("client is not allowed to see clients!", 400));
  }

  const clients = await User.find({ role: "Client" });

  res.status(200).json({
    success: true,
    clients,
  });
});

// add the client
export const addClient = async (req, res, next) => {
  try {
    const { name, email, password, company } = req.body;

    if (!name || !email || !password || !company) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newUser = new User({
      name,
      email,
      password,
      company,
      role: "Client",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Client added successfully",
      client: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
