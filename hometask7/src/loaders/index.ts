import db from "../config/database";
import modelLoader from "./model";
import { appLoader } from "./express";
import { logger } from "../shared/logger";

export default async function (): Promise<void> {
  // Check database connection
  try {
    await db.authenticate();
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }

  process
    .on("uncaughtException", (err) => {
      logger.error("Uncaught Exception thrown", err);
      process.exit(1);
    })
    .on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection at Promise", err);
    });

  modelLoader();
  appLoader();
}
