const ErrorHandler = require("../../helpers/errors/errorHandler");
const User = require("../../models/userModel");
const { sendToken } = require("../../helpers/jwtToken/tokenHelper");

const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Email and password are required", 400));
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("Email is already registered", 400));
        }
        const user = await User.create({
            email,
            password,
            role: "user"
        });
        return sendToken(user, 201, res);

    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500, error));
    }
};

module.exports = signUp;