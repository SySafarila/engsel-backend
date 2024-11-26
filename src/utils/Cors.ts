import { CorsOptions } from "cors";

export default class Cors {
  static cors(): CorsOptions {
    return {
      origin(requestOrigin, callback) {
        const rawOrigins: string = process.env.FRONT_END_URLS ?? "";
        const origins: string[] = [];
        rawOrigins.split(",").forEach((origin) => {
          if (origin && origin != "" && origin != " ") {
            origins.push(origin);
          }
        });

        if (!requestOrigin) {
          callback(null);
        } else {
          if (origins.includes(requestOrigin)) {
            callback(null, requestOrigin);
          } else {
            callback(
              new Error(`Request from ${requestOrigin} blocked by CORS`),
              requestOrigin
            );
          }
        }
      },
    };
  }
}
