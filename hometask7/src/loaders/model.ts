import db from "../config/database";
import UserModel from "../models/user";
import GroupModel from "../models/group";
import UserGroupModel from "../models/user-group";
import { Permissions } from "../shared/enum";
import { logger } from "../shared/logger";

export const userData = [
  {
    id: "b4c7010c-1aa4-4a79-a56d-c807a231e98a",
    login: "Phan De",
    password: "de",
    age: 33,
    isDeleted: false,
  },
  {
    id: "301e8e2b-09fc-43d4-8a67-c3ea673f109e",
    login: "Nguyen Linh",
    password: "linh",
    age: 31,
    isDeleted: false,
  },
  {
    id: "5c1c53e4-126f-4eeb-a4f3-ce156d1fb467",
    login: "Tran Chau",
    password: "chau",
    age: 24,
    isDeleted: false,
  },
  {
    id: "d6002d04-a149-4573-925e-363648ec6c39",
    login: "Tran Nhan",
    password: "nhan",
    age: 25,
    isDeleted: false,
  },
  {
    id: "d75b58a7-8101-4216-b279-d2ed06493bfc",
    login: "Le Phu",
    password: "phu",
    age: 24,
    isDeleted: false,
  },
];

const groupData = [
  {
    id: "fa195eed-6a50-469c-8438-f7860eaf9ca1",
    name: "A1",
    permissions: [Permissions.READ, Permissions.WRITE],
  },
];

export default async () => {
  await db.sync({ force: true });

  await UserModel.bulkCreate(userData).then(() =>
    logger.info("User data generated.")
  );

  await GroupModel.bulkCreate(groupData).then(() =>
    logger.info("Group data generated.")
  );

  UserModel.belongsToMany(GroupModel, {
    through: UserGroupModel,
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  GroupModel.belongsToMany(UserModel, {
    through: UserGroupModel,
    foreignKey: "groupId",
    onDelete: "CASCADE",
  });
};
