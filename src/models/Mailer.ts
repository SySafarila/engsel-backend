import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";

export default class Mailer {
  static async sendVerificationEmail(
    email: string,
    token: string,
    validHours: number
  ): Promise<void> {
    try {
      // Send email logic here
      logger.info(
        `Email verification sent to ${email} and valid for ${validHours} hours`
      );
      logger.info(`Verification token: ${token}`);
    } catch (error: any) {
      throw new HTTPError("Failed to send email verification", 500);
    }
  }
}
