const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/Client.Controller")

const ClientRouter = require("express").Router()

ClientRouter.post("/add-client-record", createClient)
ClientRouter.get("/all-clients-record", getAllClients)
ClientRouter.get("/single-client-record/:id", getClientById)
ClientRouter.put("/update-client-record/:id", updateClient)
ClientRouter.delete("/delete-client-record/:id", deleteClient)


module.exports = ClientRouter