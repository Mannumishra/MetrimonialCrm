const Client = require("../Models/ClientModels");
const path = require("path");
const fs = require("fs/promises");


const deleteFile = async (filePath) => {
    try {
        if (filePath) {
            const fileToDelete = path.join(__dirname, "..", filePath);
            await fs.access(fileToDelete);
            await fs.unlink(fileToDelete);
            console.log("Deleted file:", filePath);
        }
    } catch (err) {
        console.log("File not found or already deleted:", filePath);
    }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        const clientData = req.body;
        const existingClient = await Client.findOne({
            $or: [
                { "PersnolDetails.Email": clientData.PersnolDetails.Email },
                { "PersnolDetails.Mobile": clientData.PersnolDetails.Mobile },
                { "ContactDetails.MotherNumber": clientData.ContactDetails.MotherNumber },
                { "ContactDetails.FatherNumber": clientData.ContactDetails.FatherNumber },
            ],
        });

        if (existingClient) {
            if (req.files) {
                if (req.files.ProfilePicture) {
                    await deleteFile(req.files.ProfilePicture[0]?.path);
                }
                if (req.files.OtherPicture) {
                    for (const file of req.files.OtherPicture) {
                        await deleteFile(file.path);
                    }
                }
                if (req.files.UploadBiodata) {
                    await deleteFile(req.files.UploadBiodata[0]?.path);
                }
            }
            return res.status(400).json({
                message: "A client with the provided Email, Mobile, MotherNumber, or FatherNumber already exists",
            });
        }

        if (req.files) {
            if (req.files.ProfilePicture && req.files.ProfilePicture[0]) {
                clientData.ProfilePicture = req.files.ProfilePicture[0].path;
            }

            if (req.files.OtherPicture && req.files.OtherPicture.length > 0) {
                clientData.OtherPicture = req.files.OtherPicture.map((file) => file.path);
            }

            if (req.files.UploadBiodata && req.files.UploadBiodata[0]) {
                clientData.UploadBiodata = req.files.UploadBiodata[0].path;
            }
        }

        const newClient = new Client(clientData);
        await newClient.save();
        res.status(201).json({ message: "Client created successfully", client: newClient });
    } catch (error) {
        console.error(error);
        // Cleanup uploaded files
        if (req.files) {
            if (req.files.ProfilePicture) {
                await deleteFile(req.files.ProfilePicture[0]?.path);
            }
            if (req.files.OtherPicture) {
                for (const file of req.files.OtherPicture) {
                    await deleteFile(file.path);
                }
            }
            if (req.files.UploadBiodata) {
                await deleteFile(req.files.UploadBiodata[0]?.path);
            }
        }

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

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const existingClient = await Client.findById(id);

        if (!existingClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Handle new file uploads and delete old files
        if (req.files) {
            if (req.files.ProfilePicture && req.files.ProfilePicture[0]) {
                if (existingClient.ProfilePicture) {
                    await deleteFile(existingClient.ProfilePicture);
                }
                updatedData.ProfilePicture = req.files.ProfilePicture[0].path;
            }

            if (req.files.OtherPicture && req.files.OtherPicture.length > 0) {
                if (existingClient.OtherPicture) {
                    for (const oldFile of existingClient.OtherPicture) {
                        await deleteFile(oldFile);
                    }
                }
                updatedData.OtherPicture = req.files.OtherPicture.map((file) => file.path);
            }

            if (req.files.UploadBiodata && req.files.UploadBiodata[0]) {
                if (existingClient.UploadBiodata) {
                    await deleteFile(existingClient.UploadBiodata);
                }
                updatedData.UploadBiodata = req.files.UploadBiodata[0].path;
            }
        }

        const updatedClient = await Client.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: "Client updated successfully", client: updatedClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating client", error: error.message });
    }
};


const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Delete associated files
        if (client.ProfilePicture) {
            await deleteFile(client.ProfilePicture);
        }
        if (client.OtherPicture && client.OtherPicture.length > 0) {
            for (const file of client.OtherPicture) {
                await deleteFile(file);
            }
        }
        if (client.UploadBiodata) {
            await deleteFile(client.UploadBiodata);
        }

        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error(error);
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
