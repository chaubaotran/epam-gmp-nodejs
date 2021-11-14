import { NextFunction, Request, Response } from "express";

import { logger } from "./logger";

export const unhandledErrorsHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error) {
    const message = `Unhandled Error - name: ${error.name}, mesage: ${error.message}`;
    logger.error(message);

    res.status(500).json({ error: message });
  }

  next();
};

export const wrongUrlErrorHandlingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const message = `Url ${req.path} does not exist`;
  logger.error(message);

  res.status(500).json({ error: message });

  next();
};
