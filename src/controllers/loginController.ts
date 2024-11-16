import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import { Login } from "../types/Requests";
import { ErrorResponse, LoginSuccess } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import comparePassword from "../utils/comparePassword";
import errorHandler from "../utils/errorHandler";
import signJwt from "../utils/signJwt";
import { validateLogin } from "../validator/validateLogin";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as Login;
  const prisma = new PrismaClient();

  try {
    await validateLogin({
      email: email,
      password: password,
    });

    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      throw new HTTPError("User not found", 404);
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
};

export default loginController;
