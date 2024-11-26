export default class Cors {
  static parseOrigins(): string[] {
    const rawOrigins: string = process.env.FRONT_END_URLS ?? "";
    const origins: string[] = [];
    rawOrigins.split(",").forEach((origin) => {
      if (origin && origin != "" && origin != " ") {
        origins.push(origin);
      }
    });

    return origins;
  }
}
