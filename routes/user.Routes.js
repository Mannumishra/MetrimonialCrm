const {createRecord} = require("../controllers/User.Controller")

const UserRouter  = require("express").Router()

UserRouter.post("/add-user" , createRecord)

module.exports = UserRouter