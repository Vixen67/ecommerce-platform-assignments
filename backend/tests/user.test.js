const request = require("supertest");
const { AppDataSource } = require("../data-source");
const app = require("../app");

beforeAll(async () => {
    // Requirements: Initialize database connection directly for testing environment
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    // Requirements: Clean up test data after execution
    if (AppDataSource.isInitialized) {
        const repo = AppDataSource.getRepository("User"); // Update string to match your Entity class name exactly
        await repo.delete({ email: "testintegration@example.com" });
        await AppDataSource.destroy();
    }
});

describe("POST /api/users Integration Test", () => {
    it("should successfully create and store a user in PostgreSQL", async () => {
        const testUser = {
            name: "Test Integration User",
            email: "testintegration@example.com",
            password: "SecurePassword123"
        };

        // Note: Your app routes are prefixed with '/api' in app.js
        const response = await request(app)
            .post("/api/users") 
            .send(testUser);

        // Assertions
        // Assertions
        expect(response.status).toBe(201); 
        expect(response.body.user).toHaveProperty("id"); // Fixed: pointing inside 'user'
        expect(response.body.user.email).toBe(testUser.email); // Fixed: pointing inside 'user'

    });
});
