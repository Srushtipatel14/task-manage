const Task = require("../../models/taskModel");
const User = require("../../models/userModel");
const Notification=require("../../models/notificationModel")
const ErrorHandler = require("../../helpers/errors/errorHandler");

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;
    const adminId = req.admin.id;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: adminId,
    });

    const notification = await Notification.create({
      userId: assignedTo,
      message: `New task assigned: ${title}`,
      taskId: task._id,
    });

    const populatedTask = await task.populate("assignedTo", "name email");

    if (req.io) {
      const room = assignedTo.toString();

      req.io.to(room).emit("task:assigned", populatedTask);

      req.io.to(room).emit("notification:assigned", notification);
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask,
    });

  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("Something went wrong", 500, error));
  }
};

module.exports = createTask;
