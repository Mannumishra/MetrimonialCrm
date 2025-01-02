
const { createRecord, login, logout } = require("../controllers/User.Controller");
const { verifyUser } = require("../middleware/Authoraztation");

const UserRouter = require("express").Router()

UserRouter.post("/add-user", createRecord)



UserRouter.post("/log-in", login)
UserRouter.post("/log-out", verifyUser, logout);


module.exports = UserRouter