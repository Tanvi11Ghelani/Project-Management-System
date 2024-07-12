import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    modulename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Project schema
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    actual_end_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Module = mongoose.model("Module", moduleSchema);
