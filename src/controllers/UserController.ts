import { Request, Response } from "express";
import Locals from "../types/locals";
import { UpdateUser } from "../types/Requests";
import {
  ErrorResponse,
  UserDetail,
  UserDetailPublic,
  Users,
} from "../types/Responses";
import PrismaClient from "../utils/Database";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { validateUpdateUser } from "../validator/validateUpdateUser";

export default class UserController {
  static async getDetail(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { username } = req.params as { username: string };

    try {
      const checkUsername = await prisma.user.findFirst({
        where: {
          username: username,
        },
        select: {
          id: true,
          name: true,
          username: true,
          balance: true,
          email: true,
          roles: {
            select: {
              level: true,
              name: true,
            },
            orderBy: {
              level: "asc",
            },
          },
        },
      });

      if (!checkUsername) {
        throw new HTTPError("User not found", 404);
      }

      const response: UserDetail = {
        message: `Get user detail by username: ${username}`,
        user: {
          id: checkUsername.id,
          name: checkUsername.name,
          username: checkUsername.username,
          balance: Number(checkUsername.balance),
          email: checkUsername.email,
          roles: checkUsername.roles,
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

  static async getDetailPublic(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { username } = req.params as { username: string };

    try {
      const checkUsername = await prisma.user.findFirst({
        where: {
          username: username,
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });

      if (!checkUsername) {
        throw new HTTPError("User not found", 404);
      }

      const minTts = await prisma.setting.findFirst({
        where: {
          user_id: checkUsername.id,
          key: "min-amount-for-tts",
        },
      });

      const response: UserDetailPublic = {
        message: `Get user detail by username: ${username}`,
        user: {
          id: checkUsername.id,
          name: checkUsername.name,
          username: checkUsername.username,
        },
        minTts: minTts ? Number(minTts.value) : 10000,
      };

      res.json({
        message: "Success",
        data: response,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async getUsers(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { identifier } = req.query as { identifier: string };

    try {
      const users = await prisma.user.findMany({
        ...(identifier && {
          where: {
            OR: [
              {
                username: {
                  contains: identifier,
                },
              },
              {
                email: {
                  contains: identifier,
                },
              },
            ],
          },
        }),
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          balance: true,
          roles: {
            select: {
              name: true,
              level: true,
            },
            orderBy: {
              level: "asc",
            },
          },
        },
      });

      const response: Users = {
        message: `Get all users`,
        users: users.map((user) => ({
          ...user,
          balance: user.balance.toNumber(),
        })),
      };

      res.json(response);
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { user_id, role_level_peak } = res.locals as Locals;
    const { username } = req.params as { username: string };
    let selectedUserPeakRole: number = 9999;

    try {
      const currentUser = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      if (!currentUser) {
        throw new HTTPError("User not found", 404);
      }

      if (currentUser.username === username) {
        throw new HTTPError("You cannot delete yourself", 400);
      }

      const selectedUser = await prisma.user.findFirst({
        where: {
          username: username,
        },
        include: {
          roles: true,
        },
      });

      if (!selectedUser) {
        throw new HTTPError("User not found", 404);
      }

      selectedUser.roles.forEach((role) => {
        if (role.level <= selectedUserPeakRole) {
          selectedUserPeakRole = role.level;
        }
      });

      if (role_level_peak && role_level_peak >= selectedUserPeakRole) {
        throw new HTTPError("You need higher level", 401);
      }

      await prisma.user.delete({
        where: {
          username: username,
        },
      });

      res.json({
        message: `${username} deleted!`,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async update(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { username } = req.params as { username: string };
    const body = req.body as UpdateUser;

    try {
      await validateUpdateUser({
        name: body.name,
        roles: body.roles,
        username: body.username,
        email: body.email,
        balance: body.balance,
      });

      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new HTTPError("User not found", 404);
      }

      const checkUsername = await prisma.user.findFirst({
        where: {
          username: body.username,
        },
      });

      if (checkUsername && checkUsername.id != user.id) {
        throw new HTTPError("Username already registered", 400);
      }

      const checkEmail = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (checkEmail && checkEmail.id != user.id) {
        throw new HTTPError("Email already registered", 400);
      }

      const validRoles: { name: string }[] = [];
      const checkRoles = await prisma.role.findMany({
        where: {
          name: {
            in: body.roles,
          },
        },
      });

      checkRoles.forEach((checkRole) => {
        validRoles.push({ name: checkRole.name });
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: body.name,
          username: body.username,
          balance: body.balance,
          roles: {
            set: validRoles,
          },
        },
      });

      res.json({
        message: `${username} updated!`,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
