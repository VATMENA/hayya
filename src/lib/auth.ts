import jwt from "jsonwebtoken";
import { JWT_HMAC_KEY } from "$env/static/private";

export function makeToken(cid: string): string {
  return jwt.sign({ cid: cid }, JWT_HMAC_KEY);
}

export function verifyToken(token: string): string | null {
  try {
    let decoded = jwt.verify(token, JWT_HMAC_KEY) as { cid: string };
    return decoded.cid;
  } catch {
    return null;
  }
}
