import { DataTypes } from "sequelize";

import db from "../config/database";

const UserGroup = db.define("users-groups", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "groups",
      key: "id",
    },
  },
});

export default UserGroup;
