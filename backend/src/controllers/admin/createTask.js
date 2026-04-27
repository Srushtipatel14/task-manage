const Task = require("../../models/taskModel");
const User = require("../../models/userModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status } = req.body;
        const adminId = req.admin.id;
        if (!title || !description || !assignedTo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findById({ _id: assignedTo });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found ", });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy: adminId,
        });

        const populatedTask = await task.populate("assignedTo", "name email");
        if (req.io) {
          req.io.to(assignedTo.toString()).emit("task:assigned", populatedTask);
        }

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: populatedTask,
        });

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500, error));
    }
};

module.exports = createTask;
