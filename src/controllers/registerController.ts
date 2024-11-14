import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import { v7 as UUIDV7 } from "uuid";
import { Register } from "../types/Requests";
import { ErrorResponse, RegisterSuccess } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import errorHandler from "../utils/errorHandler";

const registerController = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body as Register;
  const prisma = new PrismaClient();

  try {
    const schema: Joi.ObjectSchema<Register> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().required(),
      username: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { email, password, name, username } as Register,
      options
    );

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

    res.json({
      message: "Register success",
      user: {
        name: name,
      },
    } as RegisterSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default registerController;
