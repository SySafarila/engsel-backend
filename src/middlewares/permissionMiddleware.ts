import { NextFunction, Request, Response } from "express";
import Locals from "../types/locals";

const permissionMiddleware = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const locals = res.locals as Locals;
    const checkRole = locals.roles?.includes("super-admin");

    if (checkRole) {
      next();
      return;
    }

    const checkPermission = locals.permissions?.includes(permission);

    if (!checkPermission) {
      res.status(403).json({ message: "You don't have right permission" });
      return;
    }

    next();
  };
};

export default permissionMiddleware;
