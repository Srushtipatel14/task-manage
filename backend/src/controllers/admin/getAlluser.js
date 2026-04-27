const User = require("../../models/userModel");
const ErrorHandler = require("../../helpers/errors/errorHandler");

const getAllUsers = async (req, res, next) => {
    try {
        const user = req.user;
        const users = await User.find({ role: { $ne: "admin" } })
            .select("_id email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500));
    }
};

module.exports=getAllUsers;