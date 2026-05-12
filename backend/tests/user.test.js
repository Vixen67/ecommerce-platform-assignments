const request = require("supertest");
const { AppDataSource } = require("../data-source");
const app = require("../app");

beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        const repo = AppDataSource.getRepository("User"); 
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

        const response = await request(app)
            .post("/api/users") 
            .send(testUser);

        expect(response.status).toBe(201); 
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user.email).toBe(testUser.email);
    });
});
