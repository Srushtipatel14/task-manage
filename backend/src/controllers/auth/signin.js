const ErrorHandler = require("../../helpers/errors/errorHandler");
const User = require("../../models/userModel");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Email and password are required", 400));
        }
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid credentials", 401));
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(new ErrorHandler("Invalid credentials", 401));
        }
        return sendToken(user, 200, res);

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500, error));
    }
};

module.exports = signIn;