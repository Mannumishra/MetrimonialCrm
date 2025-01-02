const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    console.log("Headers:", req.headers); // Log entire headers for debugging
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Extracted Token:", token); // Log the token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
        if (decoded.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

const verifyUser = (req, res, next) => {
    console.log("Headers:", req.headers); // Log entire headers for debugging
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Extracted Token:", token); // Log the token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY_USER);
        if (decoded.role !== "User") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Users only.",
            });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

const verifyBoth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
        if (decoded.role === "Admin") {
            req.user = decoded;
            return next();
        }

        decoded = jwt.verify(token, process.env.JWT_KEY_USER);
        if (decoded.role === "User") {
            req.user = decoded;
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Access denied. Invalid role.",
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = {
    verifyAdmin,
    verifyUser,
    verifyBoth,
};
