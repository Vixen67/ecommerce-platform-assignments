const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

module.exports = { authenticateJWT, JWT_SECRET };
