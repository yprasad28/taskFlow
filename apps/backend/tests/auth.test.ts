import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";

describe("Authentication", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "TestPass123!";
  let authToken: string;

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user with USER role", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.role).toBe("USER");
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it("should reject registration with duplicate email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Duplicate User",
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("should reject registration with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Bad Email",
          email: "not-an-email",
          password: testPassword,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject registration with short password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Short Pass",
          email: `short-${Date.now()}@example.com`,
          password: "123",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail);
      authToken = res.body.data.token;
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testEmail,
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should reject login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testPassword,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return current user with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.role).toBe("USER");
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
