import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/application/server.js";
import { addUser, removeUser } from "./test_util.js";

beforeAll(async () => {
    const databaseURL = process.env.DATABASE_URL;
    await mongoose.connect(databaseURL);
})

afterAll(async () => {
    await mongoose.disconnect();
})

describe("POST /api/user/register", () => {
    afterEach(async () => {
        await removeUser('testregister@gmail.com');
    })

    it("should register a new user", async () => {
        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "testregister@gmail.com",
                password: "Supertest@latest#123"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toBe('testregister@gmail.com');
        expect(response.body.data.profileSetup).toBe(false);
        expect(response.get('Set-Cookie')).toBeDefined();
    })

    it("should failed if request is invalid", async () => {
        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "testregister@gmail.com",
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation Failed");
        expect(response.body.data.errors).toBeDefined();
    })

    it("should failed if email already used", async () => {
        const reqData = {
            email: "testregister@gmail.com",
            password: "Supertest@latest#123"
        };

        await addUser(reqData);

        const response = await request(app)
            .post("/api/user/register")
            .send(reqData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email already used");
        expect(response.body.data).toBeNull();
    })
})