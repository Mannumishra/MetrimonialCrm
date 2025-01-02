const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./public";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 },
}).fields([
    { name: "ProfilePicture", maxCount: 1 },
    { name: "OtherPicture", maxCount: 5 },
    { name: "UploadBiodata", maxCount: 1 },
    { name: "FinalProfilePicture", maxCount: 1 },
]);


module.exports = upload;
