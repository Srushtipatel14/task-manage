const Task = require("../../models/taskModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const updateTaskStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: task,
    });

  } catch (error) {
   return next(new ErrorHandler("Something went wrong", 500));
  }
};

module.exports = updateTaskStatus;