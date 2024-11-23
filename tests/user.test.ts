import request from "supertest";
import app from "../src/server";

describe("Donation", () => {
  it("Get user detail", async () => {
    let token: string = "";
    const login = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;

    const res = await request(app)
      .get("/users/SySafarila")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("Get all users data", async () => {
    let token: string = "";
    const login = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;
    const res = await request(app)
      .get("/users")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });
});
