import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";

describe("Task CRUD", () => {
  let userToken: string;
  let userId: string;
  let taskId: string;

  const testEmail = `taskuser-${Date.now()}@example.com`;
  const testPassword = "TaskPass123!";

  beforeAll(async () => {
    // Register a test user
    const regRes = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Task Test User",
        email: testEmail,
        password: testPassword,
      });

    userToken = regRes.body.data.token;
    userId = regRes.body.data.user.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.activityLog.deleteMany({ where: { userId } });
    await prisma.task.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  });

  describe("POST /api/v1/tasks", () => {
    it("should create a new task", async () => {
      const res = await request(app)
        .post("/api/v1/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Test Task",
          description: "This is a test task",
          priority: "HIGH",
          dueDate: "2026-12-31",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe("Test Task");
      expect(res.body.data.task.description).toBe("This is a test task");
      expect(res.body.data.task.priority).toBe("HIGH");
      expect(res.body.data.task.status).toBe("PENDING");
      expect(res.body.data.task.userId).toBe(userId);
      taskId = res.body.data.task.id;
    });

    it("should reject task without title", async () => {
      const res = await request(app)
        .post("/api/v1/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          description: "No title task",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/tasks", () => {
    it("should list user tasks", async () => {
      const res = await request(app)
        .get("/api/v1/tasks")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeInstanceOf(Array);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter tasks by status", async () => {
      const res = await request(app)
        .get("/api/v1/tasks?status=PENDING")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items.every((t: { status: string }) => t.status === "PENDING")).toBe(true);
    });

    it("should search tasks by title", async () => {
      const res = await request(app)
        .get("/api/v1/tasks?search=Test")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/v1/tasks/:id", () => {
    it("should get a specific task", async () => {
      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.task.id).toBe(taskId);
      expect(res.body.data.task.title).toBe("Test Task");
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app)
        .get("/api/v1/tasks/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PATCH /api/v1/tasks/:id", () => {
    it("should update a task", async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Updated Test Task",
          status: "IN_PROGRESS",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.task.title).toBe("Updated Test Task");
      expect(res.body.data.task.status).toBe("IN_PROGRESS");
    });
  });

  describe("DELETE /api/v1/tasks/:id", () => {
    it("should delete a task", async () => {
      // Create a task to delete
      const createRes = await request(app)
        .post("/api/v1/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Delete Me" });

      const deleteId = createRes.body.data.task.id;

      const res = await request(app)
        .delete(`/api/v1/tasks/${deleteId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it's gone
      const getRes = await request(app)
        .get(`/api/v1/tasks/${deleteId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(getRes.status).toBe(404);
    });
  });

  describe("GET /api/v1/tasks/kpis", () => {
    it("should return task KPIs for the user", async () => {
      const res = await request(app)
        .get("/api/v1/tasks/kpis")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.kpis).toBeDefined();
      expect(typeof res.body.data.kpis.total).toBe("number");
      expect(typeof res.body.data.kpis.pending).toBe("number");
      expect(typeof res.body.data.kpis.completed).toBe("number");
    });
  });

  describe("Authorization", () => {
    it("should reject unauthenticated task requests", async () => {
      const res = await request(app).get("/api/v1/tasks");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should not let user access other user's tasks", async () => {
      // Create a second user
      const regRes = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
          password: "OtherPass123!",
        });

      const otherToken = regRes.body.data.token;
      const otherUserId = regRes.body.data.user.id;

      // Other user tries to access first user's task
      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.status).toBe(404);

      // Cleanup
      await prisma.user.deleteMany({ where: { id: otherUserId } });
    });
  });
});
