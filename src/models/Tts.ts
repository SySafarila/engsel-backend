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

  private async hitGoogleTtsApi(text: string): Promise<string> {
    // hit google tts API
    return text;
  }

  async generateTts(text: string): Promise<string> {
    let sound: undefined | string = undefined;

    const find = await this.find({
      isFemale: true,
      soundType: 1,
      text: text,
    });

    if (find && find.audio) {
      sound = find.audio;
    } else {
      const create = await this.generateAndSave({
        isFemale: true,
        soundType: 1,
        text: text,
      });
      sound = create.audio!;
    }

    return sound;
  }

  private async generateAndSave(values: Params) {
    const base64 = await this.hitGoogleTtsApi(values.text);
    return await this.prisma!.tts.create({
      data: {
        id: UUIDV7(),
        is_female: values.isFemale,
        sound_type: values.soundType,
        text: values.text,
        audio: base64,
      },
    });
  }

  private async find(values: Params) {
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
