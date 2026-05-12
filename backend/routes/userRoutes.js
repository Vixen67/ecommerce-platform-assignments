const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../data-source");
const { UserEntity } = require("../entities/User");
const { authenticateJWT, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();
const userRepository = AppDataSource.getRepository(UserEntity);

// POST /users - Register a new user
router.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing parameters: name, email, and password are required" });
        }

        // Check if user exists
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        // Don't return password in response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /login - Authenticate and get token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /users - Fetch list of users (Protected)
router.get("/users", authenticateJWT, async (req, res) => {
    try {
        const users = await userRepository.find({
            select: ["id", "name", "email"], // Only select safe fields
        });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
