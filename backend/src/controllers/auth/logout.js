const errorHandler = require("../../helpers/errors/errorHandler");

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        return res.status(200).json({ success: true, message: "User logout successfully" });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
}
module.exports =logout