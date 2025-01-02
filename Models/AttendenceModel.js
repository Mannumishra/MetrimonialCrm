const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    loginTime: {
        type: Date,
        required: true,
    },
    logoutTime: {
        type: Date,
    },
    workingHours: {
        type: Number,
        default: 0,
    },
});

const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);

module.exports = AttendanceModel;
