const Task = require("../../models/taskModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const getTasks = async (req, res, next) => {
    try {
        const user=req.user;
        const tasks = await Task.find({ assignedTo: user.id }).populate("createdBy", "name email");
        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500));
    }
};

module.exports = getTasks;