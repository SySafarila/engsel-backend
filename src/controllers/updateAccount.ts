import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UpdateAccount } from "../types/Requests";
import { ErrorResponse } from "../types/Responses";
import Locals from "../types/locals";
import HTTPError from "../utils/HTTPError";
import errorHandler from "../utils/errorHandler";
import { validateUpdateAccount } from "../validator/validateUpdateAccount";

const updateAccountController = async (req: Request, res: Response) => {
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
};

export default updateAccountController;
