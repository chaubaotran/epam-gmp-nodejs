import { NextFunction, Request, Response } from "express";
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
  ),
});

export const serviceMethodLoggingMiddleware = (
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
