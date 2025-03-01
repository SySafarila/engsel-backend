import { serialize } from "cookie";
import { Request } from "express";
import Domain from "./Domain";

export default class Cookie {
  static logoutCookie(req: Request): string {
    const cookie = serialize("access_token", "logout", {
      httpOnly: true,
      maxAge: 1,
      sameSite: "lax",
      path: "/",
      ...(req.headers.origin && {
        domain: `.${Domain.clear(req.headers.origin)}`,
      }),
      secure: true,
    });

    return cookie;
  }

  static loginCookie(
    req: Request,
    token: string,
    expHoursToken: number
  ): string {
    const cookie = serialize("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * expHoursToken, // 6 hours,
      sameSite: "lax",
      path: "/",
      ...(req.headers.origin && {
        domain: `.${Domain.clear(req.headers.origin)}`,
      }),
      secure: req.secure ? true : false,
    });
    return cookie;
  }
}
