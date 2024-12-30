import nodemailer from "nodemailer";
import Domain from "../utils/Domain";
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
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const domain = Domain.clear(process.env.BASE_URL!);

      await transporter.sendMail({
        from: `"no-reply" <no-reply@${domain}>`,
        to: email,
        subject: "Email Verification",
        text: `Click this link to verify your email:\nhttp://localhost:3000/auth/email-verification/${token}`,
        html: `<p>Click this link to verify your email:</p><a href="http://localhost:3000/auth/email-verification/${token}">Verify Email</a>`,
      });

      logger.info(
        `Email verification sent to ${email} and valid for ${validHours} hours`
      );
      logger.info(`Verification token: ${token}`);
    } catch (error: any) {
      logger.error(error);
      throw new HTTPError("Failed to send email verification", 500);
    }
  }
}
