const express = require("express");
const cors = require("cors");
require("reflect-metadata");
const { AppDataSource } = require("./data-source");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// Root endpoint for testing
app.get("/", (req, res) => {
    res.send("Assignment 3 Backend is running!");
});

// Initialize Data Source and start server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
