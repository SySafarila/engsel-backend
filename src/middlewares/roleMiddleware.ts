import { NextFunction, Request } from "express";
import SignedResponseType from "../types/SignedResponseType";

const roleMiddleware = (role: string) => {
  return async (req: Request, res: SignedResponseType, next: NextFunction) => {
    const checkRole = res.locals.roles?.includes(role);
    const checkSuperAdmin = res.locals.roles?.includes("super-admin");

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
