import db from "../config/database";
import modelLoader from "./model";
import appLoader from "./express";

export default async function (): Promise<void> {
  // Check database connection
  try {
    await db.authenticate();
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }

  modelLoader();
  appLoader();
}
