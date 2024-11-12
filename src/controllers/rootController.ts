import { Request, Response } from "express";

const rootController = (req: Request, res: Response) => {
  res.json({
    message: "Hello world!",
  });
};

export default rootController;
