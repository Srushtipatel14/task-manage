const sendToken = (user, statusCode, res) => {
  const token = user.generateJWTFromUser();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

const getAccessTokenFromHeader = (req) => {
  return req.cookies?.token;
};

const isTokenIncluded = (req) => {
  return !!req.cookies?.token;
};

module.exports = {
  sendToken,
  getAccessTokenFromHeader,
  isTokenIncluded,
};
