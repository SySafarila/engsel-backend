import { NextFunction, Request, Response } from "express";
import Locals from "../types/locals";

const roleMiddleware = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const locals = res.locals as Locals;
    const checkRole = locals.roles?.includes(role);
    const checkSuperAdmin = locals.roles?.includes("super-admin");

    if (checkSuperAdmin) {
      next();
      return;
    }

    if (!checkRole) {
      res.status(403).json({ message: "You don't have right role" });
      return;
    }

    next();
  };
};

export default roleMiddleware;
