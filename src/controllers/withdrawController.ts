import { Request, Response } from "express";
import Locals from "../types/locals";
import { ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import withdraw from "../utils/withdraw";
import { validateWithdraw } from "../validator/validateWithdraw";

export const withdrawCharge = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const { amount } = req.body as { amount: number };

  try {
    await validateWithdraw({ amount: amount });
    await withdraw({
      amount: amount,
      user_id: user_id,
    });

    res.json({
      message: "success",
    });
  } catch (error) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
