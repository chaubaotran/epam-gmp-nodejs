import { Sequelize } from "sequelize";

import config from ".";

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  define: {
    freezeTableName: true, // prevent changing table names once specified
    timestamps: false, // exclude timestamp columns
  },
});

export default sequelize;
