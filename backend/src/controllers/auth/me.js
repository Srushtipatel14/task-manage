
const ErrorHandler = require("../../helpers/errors/errorHandler");
const { getAccessTokenFromHeader, isTokenIncluded } = require("../../helpers/jwtToken/tokenHelper");
const jwt = require("jsonwebtoken")

const verifyMe = async (req, res) => {
    const { JWT_SECRET_KEY } = process.env;
    
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");


    if (!isTokenIncluded(req)) {
        return next(new errorHandler("Token is not available", 401));
    }
    try {
        const accessToken = getAccessTokenFromHeader(req);
        const decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
        return res.json({
            success: true,
            data: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Something went wrong", 500, error));
    }
};

module.exports = verifyMe