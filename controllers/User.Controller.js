const UserModel = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const AttendanceModel = require("../Models/AttendenceModel")
const SaltRound = 12

const createRecord = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        const errorMessage = []
        if (!name) {
            return res.status(400).json({
                success: false,
                message: errorMessage.push("Name is must required")
            })
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: errorMessage.push("Email is must required")
            })
        }
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: errorMessage.push("Phone is must required")
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: errorMessage.push("Password is must required")
            })
        }

        if (errorMessage.length) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(",")
            })
        }

        const exitData = await UserModel.findOne({
            $or: [{ email }, { phone }]
        })
        if (exitData) {
            return res.status(400).json({
                success: false,
                message: "Email or Phone number is already exit"
            })
        }

        const hashPassword = await bcrypt.hash(password, SaltRound)
        const newRecord = await new UserModel({ name, email, phone, password: hashPassword })
        await newRecord.save()
        return res.status(200).json({
            success: false,
            message: "New User Addedd Successfully",
            data: newRecord
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password Is both must required"
            })
        }
        const checkUser = await UserModel.findOne({ email: email })
        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: "Invailid Email Id"
            })
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invailid Password"
            })
        }

        // Determine the key to use based on the user's role
        const roleKey = checkUser.role === "Admin" ? process.env.JWT_KEY_ADMIN : process.env.JWT_KEY_USER;

        // Generate JWT Token
        const token = jwt.sign(
            { id: checkUser._id, email: checkUser.email, role: checkUser.role },
            roleKey,
            { expiresIn: "1h" }
        );

        // Log attendance
        const loginTime = new Date();
        await AttendanceModel.create({
            userId: checkUser._id,
            loginTime,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: checkUser,
            token: token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const logout = async (req, res) => {
    try {
        const userId = req.user.id;

        const attendanceRecord = await AttendanceModel.findOne({
            userId: userId,
            logoutTime: null, // Find the most recent login without a logout
        });

        if (!attendanceRecord) {
            return res.status(404).json({
                success: false,
                message: "No active session found for this user.",
            });
        }

        const logoutTime = new Date();
        const workingHours = (logoutTime - attendanceRecord.loginTime) / (1000 * 60 * 60); // Convert milliseconds to hours

        attendanceRecord.logoutTime = logoutTime;
        attendanceRecord.workingHours = workingHours;
        await attendanceRecord.save();

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
            attendance: attendanceRecord,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};



module.exports = {
    createRecord, login , logout
}