import bcrypt from "bcrypt";
import HTTPError from "./HTTPError";

type ComparePassword = {
  plainPassword: string;
  hashedPassword: string;
};

const comparePassword = async (values: ComparePassword) => {
  const compare: boolean = await bcrypt.compare(
    values.plainPassword,
    values.hashedPassword
  );
  if (!compare) {
    throw new HTTPError("Credentials not match", 401);
  }
};

export default comparePassword;
