import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("Overlay setting executed by Creators", () => {
  it("Get token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "sysafarila@mail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it("Creator can get overlay setting but return 404", async () => {
    const res = await request(app)
      .get("/settings/overlays/basic")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(404);
  });

  it("Creator can create or update overlay setting", async () => {
    const res = await request(app)
      .post("/settings/overlays/basic")
      .set("Authorization", `Bearer ${token}`)
      .send({
        background: "#faae2b",
        text_color: "black",
        text_color_highlight: "#744fc9",
        border_color: "black",
      });
    expect(res.statusCode).toBe(200);
  });

  it("Creator can get overlay setting but return 200", async () => {
    const res = await request(app)
      .get("/settings/overlays/basic")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
  });
});
