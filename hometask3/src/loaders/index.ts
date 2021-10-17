import sequelize from "../config/database";
import userModelLoader from "./model";
import appLoader from "./express";

export default async function (): Promise<void> {
  // Check database connection
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }

  // Init user table and data
  userModelLoader();

  // Init application
  appLoader.listen(process.env.PORT, () =>
    console.log("app is running on port 3000")
  );
}
