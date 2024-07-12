import mongoose from "mongoose";
import { Module } from "./moduleSchema.js";

// Define the Project schema
const projectSchema = new mongoose.Schema(
  {
    projectname: {
      type: String,
      required: true,
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", //  Client model
      ref: "User",
    },
    start_date: {
      type: Date,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the Project model
export const Project = mongoose.model("Project", projectSchema);
