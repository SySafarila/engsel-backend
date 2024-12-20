import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import Locals from "../types/locals";
import { ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import ValidateSetting from "../validator/ValidateSetting";

type OverlayCode = "basic" | "formula-1";

export default class SettingController {
  private static overlaySettingJson(req: Request, overlayCode: OverlayCode) {
    const overlays: OverlayCode[] = ["basic", "formula-1"];
    let setting: object = {};
    if (overlays.includes(overlayCode)) {
      switch (overlayCode) {
        case "basic":
          setting = {
            background: req.body.background ?? "#faae2b",
            text_color: req.body.text_color ?? "black",
            text_color_highlight: req.body.text_color_highlight ?? "#744fc9",
            border_color: req.body.border_color ?? "black",
          };
          break;

        case "formula-1":
          setting = {};

        default:
          setting = {};
          break;
      }
    }

    return setting;
  }

  static async setOverlaySetting(req: Request, res: Response) {
    const overlays: OverlayCode[] = ["basic", "formula-1"];
    const { overlayCode } = req.params as { overlayCode: OverlayCode };
    const { user_id } = res.locals as Locals;
    const prisma = new PrismaClient();

    try {
      if (!overlays.includes(overlayCode)) {
        throw new HTTPError("Overlay Code invalid", 400);
      }

      const value = SettingController.overlaySettingJson(req, overlayCode);

      let overlay = await prisma.setting.findFirst({
        where: {
          user_id: user_id,
          key: "overlay-" + overlayCode,
        },
        select: {
          id: true,
          key: true,
          value: true,
          user_id: true,
        },
      });

      if (!overlay) {
        overlay = await prisma.setting.create({
          data: {
            id: UUIDV7(),
            user_id: user_id,
            key: "overlay-" + overlayCode,
            value: value,
          },
          select: {
            id: true,
            key: true,
            value: true,
            user_id: true,
          },
        });
      } else {
        overlay = await prisma.setting.update({
          where: {
            id: overlay.id,
          },
          data: {
            value: value,
            updated_at: new Date(),
          },
          select: {
            id: true,
            key: true,
            value: true,
            user_id: true,
          },
        });
      }

      res.status(200).json({
        message: "Success",
        data: overlay,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async getOverlaySetting(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const overlays: OverlayCode[] = ["basic", "formula-1"];
    const { overlayCode } = req.params as { overlayCode: OverlayCode };
    const { streamkey } = req.query as { streamkey: string };

    try {
      if (!overlays.includes(overlayCode)) {
        throw new HTTPError("Overlay Code invalid", 400);
      }

      let overlay = await prisma.setting.findFirst({
        where: {
          user_id: streamkey,
          key: "overlay-" + overlayCode,
        },
        select: {
          id: true,
          key: true,
          value: true,
          user_id: true,
        },
      });

      if (!overlay) {
        throw new HTTPError("Overlay setting not found", 404);
      }

      res.status(200).json({
        message: "Success",
        data: overlay,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async minTts(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { user_id } = res.locals as Locals;
    const { amount } = req.body as { amount: number };

    try {
      await ValidateSetting.minTts({
        amount: amount,
      });

      let resSetting: Object;
      const setting = await prisma.setting.findFirst({
        where: {
          user_id: user_id,
          key: "min-amount-for-tts",
        },
      });

      if (!setting) {
        resSetting = await prisma.setting.create({
          data: {
            id: UUIDV7(),
            user_id: user_id,
            key: "min-amount-for-tts",
            value: amount,
          },
        });
      } else {
        resSetting = await prisma.setting.update({
          where: {
            id: setting.id,
          },
          data: {
            value: amount,
          },
        });
      }

      res.status(200).json({
        message: "Success",
        data: resSetting,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async getMinTts(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { user_id } = res.locals as Locals;

    try {
      let resSetting: Object | null;

      resSetting = await prisma.setting.findFirst({
        where: {
          user_id: user_id,
          key: "min-amount-for-tts",
        },
      });

      if (!resSetting) {
        throw new HTTPError("Setting for min-amount-for-tts not found", 404);
      }

      res.status(200).json({
        message: "Success",
        data: resSetting,
      });
    } catch (error: any) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
