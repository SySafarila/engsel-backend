import * as jose from "jose";
import JwtPayloadType from "../types/JwtPayloadType";

const verifyJwt = async (
  jwt: string
): Promise<{
  payload: JwtPayloadType;
  protectedHeader: jose.ProtectedHeaderParameters;
}> => {
  const tokenSecret = new TextEncoder().encode(process.env.JWT_SECRET);
  const verify = await jose.jwtVerify(jwt, tokenSecret);
  const payload = verify.payload as JwtPayloadType;
  const protectedHeader = verify.protectedHeader;

  return { payload, protectedHeader };
};

export default verifyJwt;
