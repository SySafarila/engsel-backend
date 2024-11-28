import { PrismaClient } from "@prisma/client";
import HTTPError from "../utils/HTTPError";

export default class Creator {
  prisma: PrismaClient;
  username?: string;
  name?: string;
  url?: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUsername(): Promise<void> {
    const check = await this.prisma.user.findFirst({
      where: {
        username: this.username,
      },
    });

    if (!check) {
      throw new HTTPError("Creator not found", 404);
    }
  }
}
