import { Module } from "../models/moduleSchema.js";
import { catchAsyncError } from "../middlewares/cathAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { Task } from "../models/taskSchema.js";
import { Project } from "../models/projectSchema.js";

export const postModule = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler(
        "client is not allowed to maintain the projects modules!",
        400
      )
    );
  }
  const {
    modulename,
    description,
    project_id,
    amount,
    start_date,
    end_date,
    days,
    actual_end_date,
  } = req.body;

  if (
    !modulename ||
    !description ||
    !project_id ||
    !amount ||
    !start_date ||
    !end_date ||
    !days
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const module = await Module.create({
    modulename,
    description,
    project_id,
    amount,
    start_date,
    end_date,
    days,
    actual_end_date,
  });

  res.status(201).json({
    success: true,
    module,
  });
});

//update the actual project end date

export const updateModule = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to update project module!", 400)
    );
  }

  //for update the project many of project get the perticular one project id getting

  const { id } = req.params;

  let module = await Module.findById(id);

  if (!module) {
    return next(new ErrorHandler("Oops! Module is not Found", 404));
  }

  module = await Module.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    module,
    message: "Module updated Successfully!",
  });
});

//get all the module
export const getAllModules = catchAsyncError(async (req, res, next) => {
  const modules = await Module.find();
  if (!modules) {
    return next(new ErrorHandler("No modules found.", 404));
  }
  res.status(200).json({
    success: true,
    modules,
  });
});

//delete module
export const deleteModule = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("Client is not allowed to update project module!", 400)
    );
  }

  const { id } = req.params;

  let module = await Module.findById(id);

  if (!module) {
    return next(new ErrorHandler("Module not found", 404));
  }

  await module.deleteOne(); // Assuming 'module' is the instance you want to delete
  res.status(201).json({
    success: true,
    message: "Module deleted successfully",
  });
});

// get all task in specific module include
export const modules = catchAsyncError(async (req, res, next) => {
  const { moduleId } = req.params;
  try {
    const tasks = await Task.find({ module: moduleId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// add the module
export const addModules = catchAsyncError(async (req, res, next) => {
  const {
    modulename,
    amount,
    start_date,
    end_date,
    days,
    actual_end_date,
    description,
    project_id,
  } = req.body;

  if (
    !modulename ||
    !amount ||
    !start_date ||
    !end_date ||
    !days ||
    !actual_end_date
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const newModule = new Module({
    modulename,
    amount,
    start_date,
    end_date,
    days,
    actual_end_date,
    description,
    project_id,
  });

  await newModule.save();

  res.status(201).json({
    success: true,
    message: "Module added successfully",
    newModule,
  });
});
