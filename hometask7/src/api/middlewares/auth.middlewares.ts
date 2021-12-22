import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../../config";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path === "/api/login") {
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized request");
  }

  try {
    jwt.verify(token, config.tokenSecet);

    next();
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};
