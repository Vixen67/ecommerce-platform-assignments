import request from "supertest";
import { AppDataSource } from "../data-source.js"; // Adjust path to your TypeORM source
import app from "../app.js"; // Adjust path to your express app export

beforeAll(async () => {
    // Ensure database connection is active before running tests
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    // Requirements: Clean up test data after execution
    const repo = AppDataSource.getRepository("users_assignment3");
    await repo.delete({ email: "testintegration@example.com" });
    
    // Close the connection clean
    await AppDataSource.destroy();
});

describe("POST /users Integration Test", () => {
    it("should successfully create and store a user in PostgreSQL", async () => {
        const testUser = {
            name: "Test Integration User",
            email: "testintegration@example.com",
            password: "SecurePassword123"
        };

        const response = await request(app)
            .post("/users") // Match your registration endpoint path
            .send(testUser);

        // Assertions
        expect(response.status).toBe(201); // Or 200 depending on your controller status code
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe(testUser.email);
    });
});
