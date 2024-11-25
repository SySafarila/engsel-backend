import request from "supertest";
import app from "../src/server";

let token: string = "";
let token2: string = "";

describe("Login by autorized user", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;

    const res2 = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "admin@admin.com",
        password: "password",
      });

    expect(res2.statusCode).toBe(200);
    token2 = res2.body.token;
  });
});

describe("READ roles", () => {
  it("Should success with super admin", async () => {
    const res = await request(app)
      .get("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const res2 = await request(app)
      .get("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`);

    expect(res2.statusCode).toBe(200);
  });

  it("Should success with admin", async () => {
    const res2 = await request(app)
      .get("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`);

    expect(res2.statusCode).toBe(200);
  });
});

describe("CREATE role", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "basic-user",
        level: 5,
        permissions: ["admin-access", "permissions-read"],
      });

    expect(res.statusCode).toBe(200);
  });
  it("Should fail", async () => {
    const res2 = await request(app)
      .post("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "admin2",
        level: 1,
      });

    expect(res2.statusCode).toBe(400);

    const res3 = await request(app)
      .post("/admin/roles")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "admin2",
        level: 0,
      });

    expect(res3.statusCode).toBe(400);
  });
});

describe("UPDATE roles", () => {
  it("Should success", async () => {
    const res = await request(app)
      .patch("/admin/roles/basic-user")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "advanced-user",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("advanced-user");

    const res2 = await request(app)
      .patch("/admin/roles/advanced-user")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "advanced-user",
        level: 1,
      });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.data.name).toBe("advanced-user");
    expect(res2.body.data.level).toBe(1);
  });

  it("Should fail", async () => {
    const res3 = await request(app)
      .patch("/admin/roles/advanced-user")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "advanced-user",
        level: 0,
      });

    expect(res3.statusCode).toBe(400);
  });
});

describe("DELETE role", () => {
  it("Should success", async () => {
    const res = await request(app)
      .delete("/admin/roles/advanced-user")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res2 = await request(app)
      .delete("/admin/roles/super-admin")
      .accept("application/json")
      .set("Authorization", `Bearer ${token2}`)
      .send();

    expect(res2.statusCode).toBe(400);
  });
});
