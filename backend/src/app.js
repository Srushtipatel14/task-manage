const express = require("express");
const app = express();
const ErrorHandler  = require("./helpers/errors/errorHandler");
const cors = require("cors");
const cookieparser=require("cookie-parser");
app.use(express.json());
const allowedOrigins = ['http://localhost:3000'];

const authRoute=require("./routes/authRoute");
const adminRoute=require("./routes/adminRoute")
const userRoute=require("./routes/userRoute");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        else {
            return callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}));

app.use(cookieparser());

let io;

const setSocket = (socketInstance) => {
  io = socketInstance;
};

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth",authRoute);
app.use("/api/admin",adminRoute)
app.use("/api/user",userRoute)



app.use((err, req, res, next) => {
    if (err instanceof ErrorHandler ) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            error: err.error || "No additional details provided",
        });
    }
    return res.status(500).json({
        error: "Internal Server Error",
        status: 500,
    });
});


module.exports = { app, setSocket };