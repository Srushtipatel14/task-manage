const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: [2, "title must have atleat 2 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      min: [2, "description must have atleat 2 characters"],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "{VALUE} is not supported status",
      },
      default: "todo",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "userCollection",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "userCollection",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("taskCollection", taskSchema);
