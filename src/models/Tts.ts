import { PrismaClient } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { v7 as UUIDV7 } from "uuid";
import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";

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
    const token = process.env.GOOGLE_TEXT_TO_SPEECH;

    // Performs the text-to-speech request
    const request = {
      input: {
        text: text,
      },
      voice: {
        languageCode: "id-ID",
        name: "id-ID-Standard-D",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    try {
      const res = await axios.post(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-goog-user-project": "central-rush-444509-j2",
          },
        }
      );

      return res.data.audioContent;
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error("Error while generating audio by Google Text-To-Speech");
        logger.error(error.message);
        throw new HTTPError(
          "Error while generating audio by Google Text-To-Speech",
          error.status ?? 500
        );
      } else {
        throw new HTTPError("Internal server error", 500);
      }
    }
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

async function name() {
  const tts = new Tts();

  await tts.generateTts("Halo baaang, ini testing");
}

name();
