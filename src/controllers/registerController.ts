import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import { ErrorResponse } from "../types/ErrorResponseType";
import { RegisterParams, RegisterResponseSuccess } from "../types/RegisterType";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

const registerController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as RegisterParams;
  const prisma = new PrismaClient();

  try {
    const schema: Joi.ObjectSchema<RegisterParams> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { email, password, name } as RegisterParams,
      options
    );

    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUser) {
      throw new CustomError("User already registered", 400);
    }

    const hashPassword: string = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    res.json({
      message: "Register success",
      user: {
        name: name,
      },
    } as RegisterResponseSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default registerController;
