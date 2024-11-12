import { Response } from "express";

interface SignedResponseType extends Response {
  locals: {
    user_id?: number;
    jwt?: string;
    token_id?: string;
    permissions?: string[];
    roles?: string[];
    role_level_peak?: number; // lower is higher or 1 > 2
  };
}

export default SignedResponseType;
