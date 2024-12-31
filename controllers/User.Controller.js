const UserModel = require("../Models/UserModel")
const bcrypt = require("bcrypt")
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
            data: data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// const loginValue = 
module.exports = {
    createRecord
}