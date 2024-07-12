// import { catchAsyncError } from "../middlewares/cathAsyncError.js";
// import ErrorHandler from "../middlewares/error.js";
// import { Task } from "../models/taskSchema.js";

// export const task = catchAsyncError(async (req, res, next) => {
//   const { role } = req.user;

//   if (role === "client") {
//     return next(
//       new ErrorHandler("client is not allowed to update project module!", 400)
//     );
//   }

//   const { name, description, module, status, start_date, end_date } = req.body;

//   if (!name || !description || !module || !start_date || !end_date) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide all required fields.",
//     });
//   }

//   const task = await Task.create({
//     name,
//     description,
//     module,
//     status,
//     start_date,
//     end_date,
//   });

//   res.status(201).json({
//     success: true,
//     task,
//   });
// });

// // update task
// export const updateTask = catchAsyncError(async (req, res, next) => {
//   const { role } = req.user;

//   if (role === "client") {
//     return next(
//       new ErrorHandler("client is not allowed to update project module!", 400)
//     );
//   }

//   //for update the project many of project get the perticular one project id getting

//   const { id } = req.params;

//   let task = await Task.findById(id);

//   if (!task) {
//     return next(new ErrorHandler("Oops! task is not Found", 404));
//   }

//   task = await Task.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//     userFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     task,
//     message: "Task updated Successfully!",
//   });
// });

// // get all task in specific module include
// export const getTasksByModule = catchAsyncError(async (req, res, next) => {
//   const tasks = await Task.find({ module_id: req.params.module });

//   if (!tasks || tasks.length === 0) {
//     return next(new ErrorHandler("No tasks found for this module.", 404));
//   }

//   res.status(200).json({
//     success: true,
//     tasks,
//   });
// });

// //delete task
// export const deleteTask = catchAsyncError(async (req, res, next) => {
//   const { role } = req.user;

//   if (role === "client") {
//     return next(
//       new ErrorHandler("client is not allowed to update project module!", 400)
//     );
//   }

//   const { id } = req.params;

//   let task = await Task.findById(id);

//   if (!task) {
//     return next(new ErrorHandler("Oops! task is not Found", 404));
//   }
//   await task.deleteOne();
//   res.status(201).json({
//     success: true,
//     message: "Task Deleted SuccessFully",
//   });
// });

// //get all task
// export const getAllTasks = catchAsyncError(async (req, res, next) => {
//   const tasks = await Task.find();
//   res.status(200).json({
//     success: true,
//     tasks,
//   });
// });

// // add new task
// export const addTask = catchAsyncError(async (req, res, next) => {
//   const newTask = new Task(req.body);
//   try {
//     const savedTask = await newTask.save();
//     res.status(201).json({ task: savedTask });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/taskSchema.js";
import { catchAsyncError } from "../middlewares/cathAsyncError.js";

// Middleware to handle async errors
export const task = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler(
        "Clients are not allowed to update project modules!",
        400
      )
    );
  }

  const { name, description, module, status, start_date, end_date } = req.body;

  if (!name || !description || !module || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const task = await Task.create({
    name,
    description,
    module,
    status,
    start_date,
    end_date,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

// Update task
export const updateTask = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler(
        "Clients are not allowed to update project modules!",
        400
      )
    );
  }

  const { id } = req.params;

  let task = await Task.findById(id);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    task,
    message: "Task updated successfully!",
  });
});

// Get tasks by module
export const getTasksByModule = catchAsyncError(async (req, res, next) => {
  const tasks = await Task.find({ module: req.params.module });

  if (!tasks || tasks.length === 0) {
    return next(new ErrorHandler("No tasks found for this module.", 404));
  }

  res.status(200).json({
    success: true,
    tasks,
  });
});

// Delete task
export const deleteTask = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler(
        "Clients are not allowed to update project modules!",
        400
      )
    );
  }

  const { id } = req.params;

  let task = await Task.findById(id);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

// Get all tasks
export const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await Task.find();

  res.status(200).json({
    success: true,
    tasks,
  });
});

// Add task
export const addTasks = catchAsyncError(async (req, res, next) => {
  const { name, status, start_date, end_date, module, description } = req.body;

  if (!name || !status || !start_date || !end_date) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const newTask = new Task({
    name,
    status,
    start_date,
    end_date,
    module,
  });

  await newTask.save();

  res.status(201).json({
    success: true,
    message: "Project added successfully",
    newTask,
  });
});
