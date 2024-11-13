import bcrypt from "bcrypt";
import * as jose from "jose";
import JwtPayloadType from "../types/JwtPayloadType";

const signJwt = async (
  user_id: string
): Promise<{ token: string; payload: JwtPayloadType; expHours: number }> => {
  const tokenSecret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token_unique = await bcrypt.genSalt(10);
  const payload: JwtPayloadType = {
    user_id: user_id,
    randomizer: new Date().getTime(),
    token_id: token_unique,
  };
  const expHours = 6;
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT", kid: token_unique })
    .setIssuedAt()
    .setExpirationTime(`${expHours} hours`)
    .sign(tokenSecret);

  return { token, payload, expHours };
};

export default signJwt;
