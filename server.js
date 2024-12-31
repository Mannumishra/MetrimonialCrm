const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const { connectDb } = require("./Database/ConnectDB")
const cors = require("cors")
const UserRouter = require("./routes/user.Routes")
const ClientRouter = require("./routes/Client.Routes")



const app = express()

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Server Is Running"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})



app.use("/api/V1", UserRouter)
app.use("/api/V1", ClientRouter)






app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running at ${process.env.SERVER_PORT}`)
})


connectDb()