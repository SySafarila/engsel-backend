import { PrismaClient } from "@prisma/client";
import { v7 as UUIDV7 } from "uuid";

type Params = {
  text: string;
  isFemale: boolean;
  soundType: number;
};

export default class Tts {
  private prisma: PrismaClient | undefined;

  constructor(prisma?: PrismaClient) {
    if (!this.prisma) {
      this.prisma = prisma ?? new PrismaClient();
    }
  }

  async create(values: Params) {
    return await this.prisma!.tts.create({
      data: {
        id: UUIDV7(),
        is_female: values.isFemale,
        sound_type: values.soundType,
        text: values.text,
      },
    });
  }

  async findEqual(values: Params) {
    return await this.prisma!.tts.findFirst({
      where: {
        text: {
          equals: values.text,
        },
        is_female: {
          equals: values.isFemale,
        },
        sound_type: {
          equals: values.soundType,
        },
      },
    });
  }
}
