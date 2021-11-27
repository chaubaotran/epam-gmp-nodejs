import { NextFunction, Request, Response } from "express";

import { logger } from "../../shared/logger";

export const httpLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, path, params, query, body } = req;
  const message = `[${method}] ${path} - params: ${JSON.stringify(
    params
  )}, query: ${JSON.stringify(query)}, body: ${JSON.stringify(body)}`;

  logger.info(message);

  next();
};
