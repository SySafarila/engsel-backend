import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("User", () => {
  it("Login", async () => {
    const login = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;
  });

  it("Admin can get user detail", async () => {
    const res = await request(app)
      .get("/admin/users/SySafarila")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("Admin can get all users data", async () => {
    const res = await request(app)
      .get("/admin/users")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });
});
