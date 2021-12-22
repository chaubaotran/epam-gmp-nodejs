import { DataTypes } from "sequelize";

import db from "../config/database";

const Group = db.define("groups", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ARRAY(
      DataTypes.ENUM({
        values: ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"],
      })
    ),
    allowNull: false,
  },
});

export default Group;
