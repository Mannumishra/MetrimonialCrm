const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/Client.Controller")
const { verifyUser } = require("../middleware/Authoraztation")
const upload = require("../middleware/Multer")



const ClientRouter = require("express").Router()

ClientRouter.post("/add-client-record", upload, createClient)

ClientRouter.get("/all-clients-record",verifyUser, getAllClients)

ClientRouter.get("/single-client-record/:id", getClientById)

ClientRouter.put("/update-client-record/:id", upload, updateClient)

ClientRouter.delete("/delete-client-record/:id", deleteClient)


module.exports = ClientRouter