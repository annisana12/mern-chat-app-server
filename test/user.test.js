import request from "supertest";
import mongoose from "mongoose";
import path from 'path';
import { app } from "../src/application/server.js";
import { addUser, removeUser, updateUserProfileImage } from "./test_util.js";
import { deleteFile } from "../src/helper/supabase-storage.js";

beforeAll(async () => {
    const databaseURL = process.env.DATABASE_URL;
    await mongoose.connect(databaseURL);
})

afterAll(async () => {
    await mongoose.disconnect();
})

describe("POST /api/user/profile", () => {
    const userData = {
        email: 'testuser@gmail.com',
        password: 'Supertest@latest#123'
    };

    const updatedData = {
        name: 'Test User',
        bgColor: 'bg-violet-600'
    }

    let accessToken = null;

    beforeEach(async () => {
        await addUser(userData);

        const loginResponse = await request(app)
            .post("/api/login")
            .send(userData);

        accessToken = loginResponse.body.accessToken;
    })

    afterEach(async () => {
        await removeUser(userData.email);
    })

    it("should update user data with no profile image", async () => {
        const response = await request(app)
            .post("/api/user/profile")
            .set('Authorization', `Bearer ${accessToken}`)
            .field('name', updatedData.name)
            .field('bgColor', updatedData.bgColor);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.profileSetup).toBeTruthy();
        expect(response.body.data.name).toBe(updatedData.name);
        expect(response.body.data.bgColor).toBe(updatedData.bgColor);
        expect(response.body.data.profileImage).toBeNull();
    })

    it("should update user data with profile image", async () => {
        const response = await request(app)
            .post("/api/user/profile")
            .set('Authorization', `Bearer ${accessToken}`)
            .field('name', updatedData.name)
            .field('bgColor', updatedData.bgColor)
            .attach('profileImage', path.join(__dirname, './assets/avatar.jpg'));

        const imagePath = `${response.body.data.id}.jpg`;

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.profileSetup).toBeTruthy();
        expect(response.body.data.name).toBe(updatedData.name);
        expect(response.body.data.bgColor).toBe(updatedData.bgColor);
        expect(response.body.data.profileImage).toBe(imagePath);

        await deleteFile('avatars', [imagePath]);
    })

    it("should failed if request is invalid", async () => {
        const response = await request(app)
            .post("/api/user/profile")
            .set('Authorization', `Bearer ${accessToken}`)
            .field('name', updatedData.name)
            .field('bgColor', '')
            .attach('profileImage', path.join(__dirname, './assets/avatar.jpg'));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation Failed");
        expect(response.body.data.errors).toBeDefined();
    })
})

describe("GET /api/user/profile-image", () => {
    const userData = {
        email: 'testuser@gmail.com',
        password: 'Supertest@latest#123',
        name: 'Test User',
        bgColor: 'bg-violet-600',
        profileSetup: true
    };

    let accessToken = null;
    let userId = '';

    beforeEach(async () => {
        await addUser(userData);

        const loginResponse = await request(app)
            .post("/api/login")
            .send(userData);

        accessToken = loginResponse.body.accessToken;
        userId = loginResponse.body.data.id;
    })

    afterEach(async () => {
        await removeUser(userData.email);
    })

    it("should return image signed url", async () => {
        await updateUserProfileImage(userId);

        const response = await request(app)
            .get("/api/user/profile-image")
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toBe(200);
        expect(response.body.data).toContain(`${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/sign/avatars/${userId}.jpg`);
    })

    it("should return null", async () => {
        const response = await request(app)
            .get("/api/user/profile-image")
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toBe(200);
        expect(response.body.data).toBeNull();
    })
})