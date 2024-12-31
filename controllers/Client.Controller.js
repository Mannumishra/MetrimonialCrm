const Client = require("../Models/ClientModels");


// Create a new client
const createClient = async (req, res) => {
    try {
        const clientData = req.body;
        console.log(req.body)
        const existingClient = await Client.findOne({
            $or: [
                { "PersnolDetails.Email": clientData.PersnolDetails.Email },
                { "PersnolDetails.Mobile": clientData.PersnolDetails.Mobile },
                { "ContactDetails.MotherNumber": clientData.ContactDetails.MotherNumber },
                { "ContactDetails.FatherNumber": clientData.ContactDetails.FatherNumber },
            ],
        });

        if (existingClient) {
            return res.status(400).json({
                message: "A client with the provided Email, Mobile, MotherNumber, or FatherNumber already exists",
            });
        }
        const newClient = new Client(clientData);
        await newClient.save();
        res.status(201).json({ message: "Client created successfully", client: newClient });
    } catch (error) {
        res.status(500).json({ message: "Error creating client", error: error.message });
    }
};

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching clients", error: error.message });
    }
};

// Get a client by ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error fetching client", error: error.message });
    }
};

// Update a client by ID
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedClient = await Client.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client updated successfully", client: updatedClient });
    } catch (error) {
        res.status(500).json({ message: "Error updating client", error: error.message });
    }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);
        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client", error: error.message });
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};
