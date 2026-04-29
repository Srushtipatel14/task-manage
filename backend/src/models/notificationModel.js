const mongoose =require("mongoose")
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userCollection"
    },

    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    taskId: {
        type: mongoose.Types.ObjectId,
        ref: "taskCollection"
    }
}, { timestamps: true });

module.exports = mongoose.model("notificationCollection", notificationSchema);