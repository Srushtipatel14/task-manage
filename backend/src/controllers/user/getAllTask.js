const Task = require("../../models/taskModel");
const Notification = require("../../models/notificationModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const getTasks = async (req, res, next) => {
    try {
        const user = req.user;
        const tasks = await Task.find({ assignedTo: user.id }).populate("createdBy", "name email").sort({ createdAt: -1 });

        const notifications = await Notification.find({ userId: user.id })
            .sort({ isRead: 1, createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: { tasks, notifications },
        });

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500));
    }
};

module.exports = getTasks;