import { NextFunction, Request, Response } from "express";

import { logger } from "../../shared/logger";
import { ErrorNames } from "../../shared/enum";

export const controllerErrorsHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === ErrorNames.NOT_FOUND) {
    res.status(404).json({ error: error.message });
  } else if (error.name === ErrorNames.SEQUELIZE_DATABASE_ERROR) {
    res.status(500).json({ error: error.message });
  } else {
    next(error);
  }
};

export const unhandledErrorsHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error) {
    const message = `Unhandled Error: ${error.name}, mesage: ${error.message}`;
    logger.error(message);

    res.status(500).json({ error: message });
  }

  next();
};

export const wrongUrlErrorHandlingMiddleware = (
  req: Request,
  res: Response
): void => {
  const message = `Wrong URL Error: ${req.path} does not exist`;
  logger.error(message);

  res.status(404).json({ error: message });
};
