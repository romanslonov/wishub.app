import type { Request, Response, NextFunction } from "express";
import { verifyRequestOrigin } from "lucia";

export function csrfProtection(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.method === "GET") {
    return next();
  }
  const originHeader = request.headers.origin ?? null;
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.host ?? null;
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return response.status(403).end();
  }

  return next();
}
