import { parse } from "cookie";
import { NextFunction, Request, Response } from "express";
import Cookies from "../types/Cookies";
import Locals from "../types/locals";
import { LogoutSuccess } from "../types/Responses";
import Cookie from "../utils/Cookie";
import PrismaClient from "../utils/Database";
import HTTPError from "../utils/HTTPError";
import Token from "../utils/Token";

const logoutMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let jwt: string | undefined = undefined;
    const locals = res.locals as Locals;
    const prisma = PrismaClient;
    const { authorization } = req.headers;

    if (authorization) {
      const bearerToken = authorization.split("Bearer ");
      if (bearerToken[1]) {
        jwt = bearerToken[1];
      }
    }

    if (req.headers.cookie) {
      const cookies: Cookies = parse(req.headers.cookie);
      jwt = cookies.access_token;
    }

    if (!jwt) {
      throw new HTTPError("Token required", 401);
    }

    const { payload } = await Token.verifyJwt(jwt);
    const { token_id } = payload;

    const token = await prisma.token.findFirst({
      where: {
        token_id: payload.token_id,
        is_active: true,
      },
    });

    if (!token) {
      throw new HTTPError("Token invalid", 401);
    }

    locals.token_id = token_id;

    return next();
  } catch (error: any) {
    const cookie = Cookie.logoutCookie(req);
    res
      .status(200)
      .setHeader("Set-Cookie", cookie)
      .json({
        message:
          "Logout fail, but we still sent 200 status code to clear your cookie",
      } as LogoutSuccess);
  }
};

export default logoutMiddleware;
