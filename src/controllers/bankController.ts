import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Locals from "../types/locals";
import { ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import { validate as validateUUID, v7 as UUIDV7 } from "uuid";
import HTTPError from "../utils/HTTPError";
import { BankCreate } from "../types/Requests";
import { validateBank } from "../validator/validateBank";

export const getBanks = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const prisma = new PrismaClient();

  try {
    const banks = await prisma.bank.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        id: true,
        bank: true,
        number: true,
        verified_at: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    const response = {
      message: "success",
      data: banks.map((bank) => ({
        ...bank,
        verified_at: bank.verified_at
          ? new Date(bank.verified_at).getTime()
          : null,
        number: Number(bank.number),
      })),
    };

    res.status(200).json(response);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const deleteBank = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const { bankId } = req.params as { bankId: string };
  const prisma = new PrismaClient();

  try {
    const validateBankId = validateUUID(bankId);

    if (!validateBankId) {
      throw new HTTPError("Invalid Bank ID", 400);
    }

    await prisma.bank.delete({
      where: {
        user_id: user_id,
        id: bankId,
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const storeBank = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const prisma = new PrismaClient();
  const { bank, number } = req.body as BankCreate;

  try {
    await validateBank({
      bank: bank,
      number: number,
    });
    await prisma.bank.create({
      data: {
        id: UUIDV7(),
        bank: bank,
        number: number,
        user_id: user_id,
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
