import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("Get token", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "sysafarila@mail.com",
        password: "password",
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });
});

describe("Set minimal amount for TTS", () => {
  it("Should success", async () => {
    const res = await request(app)
      .patch("/settings/min-tts")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 20000,
      });

    expect(res.statusCode).toBe(200);
  });
});

describe("Get minimal amount for TTS", () => {
  it("Should success", async () => {
    const res = await request(app)
      .get("/settings/min-tts")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });
});
