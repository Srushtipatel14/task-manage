const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => emailValidator.validate(value),
            message: (props) => `${props.value} is not a valid email`
        }
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },

    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "{VALUE} is not a supported role"
        },
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateJWTFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

    const payload = {
        id: this._id,
        email: this.email,
        role: this.role,
    };

    return jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("userCollection", userSchema);