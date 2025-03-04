import { PrismaClient as PC } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { v7 as UUIDV7 } from "uuid";
import PrismaClient from "../utils/Database";
import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";

type Params = {
  text: string;
  isFemale: boolean;
  soundType: number;
};

export default class Tts {
  private prisma: PC = PrismaClient;

  private async hitGoogleTtsApi(text: string): Promise<string | null> {
    const token = process.env.GOOGLE_TEXT_TO_SPEECH_API_KEY;

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

    if (!token) {
      logger.error("GOOGLE_TEXT_TO_SPEECH_API_KEY not set");
      return null;
      // throw new HTTPError("GOOGLE_TEXT_TO_SPEECH_API_KEY not set", 500);
    }

    try {
      const res = await axios.post(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        request,
        {
          params: {
            key: token,
          },
        }
      );

      const audio: string = res.data.audioContent;

      return audio;
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error("Error while generating audio by Google Text-To-Speech");
        logger.error(error.message);
        logger.error(error.response?.data.error.message);
        return null;
        // throw new HTTPError(
        //   "Error while generating audio by Google Text-To-Speech",
        //   error.status ?? 500
        // );
      }

      logger.error("Error while generating audio by Google Text-To-Speech");
      logger.error(error);
      throw new HTTPError("Internal server error", 500, error as Error);
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

    return sound as string;
  }

  private async generateAndSave(values: Params) {
    const base64 = await this.hitGoogleTtsApi(values.text);
    return await this.prisma.tts.create({
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
    return await this.prisma.tts.findFirst({
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
