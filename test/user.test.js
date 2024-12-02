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

        expect(response.status).toBe(201);
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

describe("POST /api/user/login", () => {
    const userData = {
        email: 'testlogin@gmail.com',
        password: 'Supertest@latest#123',
        profileSetup: true,
        name: 'Supertest',
        profileImage: 'https://unsplash.com/photos/the-sun-is-setting-over-a-field-of-flowers-p0kzFn1BGOk'
    };

    beforeEach(async () => {
        await addUser(userData)
    })

    afterEach(async () => {
        await removeUser(userData.email);
    })

    it("should login a user", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.profileSetup).toBe(userData.profileSetup);
        expect(response.body.data.name).toBe(userData.name);
        expect(response.body.data.profileImage).toBe(userData.profileImage);
        expect(response.get('Set-Cookie')).toBeDefined();
    })

    it("should failed if request is invalid", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: userData.email,
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation Failed");
        expect(response.body.data.errors).toBeDefined();
    })

    it("should failed if email not found", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "wrongemail@gmail.com",
                password: userData.password
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Email or Password is incorrect");
        expect(response.body.data).toBeNull();
    })

    it("should failed if password is incorrect", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: userData.email,
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Email or Password is incorrect");
        expect(response.body.data).toBeNull();
    })
})