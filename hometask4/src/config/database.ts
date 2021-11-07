import { Sequelize } from "sequelize";

import config from ".";

const sequelize = new Sequelize(config.databaseUrl);

export default sequelize;
