import UserModel from "../models/user";

const userData = [
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

export default async () => {
  await UserModel.sync({ force: true }).then(() =>
    console.log("User table created.")
  );
  await UserModel.bulkCreate(userData);
};
