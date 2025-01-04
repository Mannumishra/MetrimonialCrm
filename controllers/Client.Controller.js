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

const createClient = async (req, res) => {
    try {
        console.log("Body Data", req.body);
        console.log("File Data", req.files);

        const persnolDetails = JSON.parse(req.body.PersnolDetails);
        const educationDetails = JSON.parse(req.body.EducationDetails);
        const familyDetails = JSON.parse(req.body.familyDetails);
        const contactDetails = JSON.parse(req.body.ContactDetails);

        const clientData = {
            ...req.body,
            PersnolDetails: persnolDetails,
            EducationDetails: educationDetails,
            familyDetails: familyDetails,
            ContactDetails: contactDetails,
        };

        const requiredFields = [
            "PersnolDetails.Name",
            "PersnolDetails.Religion",
            "PersnolDetails.Gender",
            "PersnolDetails.DateofBirth",
            "PersnolDetails.TimeofBirth",
            "PersnolDetails.PlaceofBirth",
            "PersnolDetails.MaritalStatus",
            "PersnolDetails.PartnerPreferences",
            "PersnolDetails.Complexion",
            "PersnolDetails.Hobbies",
            "PersnolDetails.DrinkingHabits",
            "PersnolDetails.EatingHabits",
            "PersnolDetails.Email",
            "PersnolDetails.Mobile",
            "PersnolDetails.Gotra",
            "PersnolDetails.Caste",
            "PersnolDetails.Astrologically",
            "PersnolDetails.Height",
            "PersnolDetails.SmokingHabits",
            "PersnolDetails.Disability",
            "PersnolDetails.SendBiodata",
            "PersnolDetails.ProfileSourcedFrom",
            "EducationDetails.School",
            "EducationDetails.Residence",
            "EducationDetails.PersonalIncome",
            "EducationDetails.OccupationDetails",
            "familyDetails.FatherName",
            "familyDetails.FatherOccupation",
            "familyDetails.FatherQualification",
            "familyDetails.FatherOccupationDetails",
            "familyDetails.MotherName",
            "familyDetails.MotherOccupation",
            // "familyDetails.MotherQualificatation",
            "ContactDetails.HouseStatus",
        ];


        const missingFields = requiredFields.filter((field) => {
            const keys = field.split(".");
            let value = clientData;
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) return true;
            }
            return false;
        });

        if (missingFields.length > 0) {
            if (req.files) {
                await cleanupFiles(req.files);
            }
            return res.status(400).json({
                message: "Missing required fields",
                missingFields,
            });
        }

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
                await cleanupFiles(req.files);
            }
            return res.status(400).json({
                message: "A client with the provided Email, Mobile, MotherNumber, or FatherNumber already exists",
            });
        }

        const newClient = new Client(clientData);
        await newClient.save();
        res.status(201).json({ message: "Client created successfully", client: newClient });
    } catch (error) {
        console.error("Error:", error);
        if (req.files) {
            await cleanupFiles(req.files);
        }
        if (error.name === "ValidationError") {
            const validationErrors = Object.keys(error.errors).map((key) => ({
                field: key,
                message: error.errors[key].message,
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors,
            });
        }
        res.status(500).json({ message: "Error creating client", error: error.message });
    }
};

const cleanupFiles = async (files) => {
    if (files.ProfilePicture) {
        await deleteFile(files.ProfilePicture[0]?.path);
    }
    if (files.OtherPicture) {
        for (const file of files.OtherPicture) {
            await deleteFile(file.path);
        }
    }
    if (files.UploadBiodata) {
        await deleteFile(files.UploadBiodata[0]?.path);
    }
    if (files.FinalProfilePicture) {
        await deleteFile(files.FinalProfilePicture[0]?.path);
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

            if (req.files.FinalProfilePicture && req.files.FinalProfilePicture[0]) {
                if (existingClient.FinalProfilePicture) {
                    await deleteFile(existingClient.FinalProfilePicture);
                }
                updatedData.FinalProfilePicture = req.files.FinalProfilePicture[0].path;
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
        if (client.FinalProfilePicture) {
            await deleteFile(client.FinalProfilePicture);
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
