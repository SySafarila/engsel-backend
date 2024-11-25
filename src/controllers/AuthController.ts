import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import { Login, Register, UpdateAccount } from "../types/Requests";
import {
  CurrentUserSuccess,
  ErrorResponse,
  LoginSuccess,
  LogoutSuccess,
  RegisterSuccess,
} from "../types/Responses";
import Locals from "../types/locals";
import HTTPError from "../utils/HTTPError";
import comparePassword from "../utils/comparePassword";
import errorHandler from "../utils/errorHandler";
import signJwt from "../utils/signJwt";
import AuthValidator from "../validator/AuthValidator";
import { validateUpdateAccount } from "../validator/validateUpdateAccount";

export default class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body as Login;
    const prisma = new PrismaClient();

    try {
      await AuthValidator.login({
        email: email,
        password: password,
      });

      const findUser = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!findUser) {
        throw new HTTPError("Credentials not match", 401);
      }

      await comparePassword({
        plainPassword: password,
        hashedPassword: findUser.password,
      });

      const token = await signJwt(findUser.id);

      await prisma.token.create({
        data: {
          id: UUIDV7(),
          token_id: token.payload.token_id,
          users: {
            connect: {
              id: findUser.id,
            },
          },
        },
      });

      const response: LoginSuccess = {
        message: `Login success. Your token valid for ${token.expHours} hours from now`,
        token: token.token,
      };

      res.json(response);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async register(req: Request, res: Response) {
    const { email, password, name, username } = req.body as Register;
    const prisma = new PrismaClient();

    try {
      await AuthValidator.register({
        email: email,
        name: name,
        password: password,
        username: username,
      });

      const findUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: email,
            },
            {
              username: username,
            },
          ],
        },
      });

      if (findUser) {
        throw new HTTPError("Username or email already registered", 400);
      }

      const hashPassword: string = bcrypt.hashSync(password, 10);

      await prisma.user.create({
        data: {
          id: UUIDV7(),
          name: name,
          username: username,
          email: email,
          password: hashPassword,
        },
      });

      const response: RegisterSuccess = {
        message: "Register success",
        user: {
          name: name,
          username: username,
        },
      };

      res.json(response);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async me(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { user_id } = res.locals as Locals;

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          verified_at: true,
          updated_at: true,
          created_at: true,
          balance: true,
          roles: {
            select: {
              name: true,
              level: true,
            },
          },
        },
      });

      if (!user) {
        throw new HTTPError("User not found", 404);
      }

      const response: CurrentUserSuccess = {
        message: "Success",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          verified_at: user.verified_at ?? undefined,
          updated_at: user.updated_at,
          created_at: user.created_at,
          balance: Number(user.balance),
        },
        roles: user.roles,
      };

      res.json(response);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async updateMe(req: Request, res: Response) {
    const { user_id } = res.locals as Locals;
    const { email, password, name, username } = req.body as UpdateAccount;
    const prisma = new PrismaClient();

    try {
      await validateUpdateAccount({
        email: email,
        password: password,
        name: name,
        username: username,
      });

      const currentUser = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      if (!currentUser) {
        throw new HTTPError("User not found", 404);
      }

      if (username != currentUser.username) {
        const checkUsername = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });

        if (checkUsername) {
          throw new HTTPError("Username already taken", 400);
        }
      }

      if (email != currentUser.email) {
        const checkEmail = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (checkEmail) {
          throw new HTTPError("Email already registered", 400);
        }
      }

      let hashPassword: string = "";
      if (password) {
        hashPassword = bcrypt.hashSync(password, 10);
      }

      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          email: email,
          password: password ? hashPassword : currentUser.password,
          name: name,
          username: username,
        },
      });

      const response = {
        message: "Profile updated!",
      };

      res.json(response);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async logout(req: Request, res: Response) {
    const { token_id } = res.locals as Locals;
    const prisma = new PrismaClient();

    try {
      const findToken = await prisma.token.findFirst({
        where: {
          token_id: token_id,
        },
      });

      if (!findToken) {
        throw new HTTPError("Token not found", 404);
      }

      await prisma.token.update({
        where: {
          id: findToken.id,
        },
        data: {
          is_active: false,
        },
      });

      res.json({
        message: "Logout success",
      } as LogoutSuccess);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
