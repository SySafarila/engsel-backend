import bcrypt from "bcrypt";
import HTTPError from "./HTTPError";

type ComparePassword = {
  plainPassword: string;
  hashedPassword: string;
};

export default class Password {
  static async compare(values: ComparePassword) {
    const compare: boolean = await bcrypt.compare(
      values.plainPassword,
      values.hashedPassword
    );
    if (!compare) {
      throw new HTTPError("Credentials not match", 401);
    }
  }

  static hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
