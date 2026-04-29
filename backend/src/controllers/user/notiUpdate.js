const Notification = require("../../models/notificationModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500));
    }
};

module.exports = markAllAsRead