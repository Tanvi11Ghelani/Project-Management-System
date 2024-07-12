import { Project } from "../models/projectSchema.js";
import { catchAsyncError } from "../middlewares/cathAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { Module } from "../models/moduleSchema.js";

// post project
export const postProject = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to post the projects!", 400)
    );
  }

  //now for post job
  const { projectname, client_id, start_date, description } = req.body;

  if (!projectname || !client_id || !start_date || !description) {
    return next(
      new ErrorHandler("Provide all details which is provided into project")
    );
  }

  //get id who is posted the project
  const postedBy = req.user._id;

  const project = await Project.create({
    projectname,
    client_id,
    start_date,
    description,
    postedBy,
    modules,
  });

  await project.save();
  res.status(200).json({
    success: true,
    message: "Project data created Successfully",
    project,
  });
});

//update project
export const updateProject = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to post the projects!", 400)
    );
  }

  //many of project for that get project id
  const { id } = req.params;

  let project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Oops! Project is not Found", 404));
  }

  //if getting the job
  project = await Project.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    project,
    message: "Project updated Successfully!",
  });
});

//get all the projects
export const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();
  res.status(200).json({
    success: true,
    projects,
  });
});

//delete the project
export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "client") {
    return next(
      new ErrorHandler("client is not allowed to post the projects!", 400)
    );
  }

  const { id } = req.params;

  let project = await Project.findById(id);

  if (!project) {
    return next(new ErrorHandler("Oops! Project is not Found", 404));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project Deleted Successfully!",
  });
});

//get single project
export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project is not exist", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});

// get all module in specific project include
export const projects = catchAsyncError(async (req, res, next) => {
  const modules = await Module.find({ project_id: req.params.id });

  if (!modules || modules.length === 0) {
    return next(new ErrorHandler("No module found for this project.", 404));
  }

  res.status(200).json({
    success: true,
    modules,
  });
});

//create new Project
export const createProject = catchAsyncError(async (req, res, next) => {
  const { name, description, start_date, complete } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      start_date: new Date(start_date), // Assuming start_date is received as a string
      complete,
    });

    await newProject.save();
    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// add the project
export const addProject = async (req, res, next) => {
  try {
    const { projectname, description, start_date, complete } = req.body;

    if (!projectname || !description || !start_date || !complete) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newProject = new Project({
      projectname,
      description,
      start_date,
      complete,
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: "Project added successfully",
      newProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
