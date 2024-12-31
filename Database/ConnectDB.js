const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database Connected Successfully`)
    } catch (error) {
        console.log("Database not connected successfully")
    }
}


module.exports = {
    connectDb
}