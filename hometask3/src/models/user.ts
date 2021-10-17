import { DataTypes } from "sequelize";

import db from "../config/database";

const User = db.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
  },
  login: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default User;
