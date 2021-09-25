import express, { Response, Request, NextFunction } from "express";
import { find } from "lodash";
import { v4 } from "uuid";
import Joi from "joi";

const app = express();
app.use(express.json());

interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}
const users: Array<User> = [];

const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required().alphanum(),
  age: Joi.number().required().min(4).max(130),
});

type UserSchema = typeof userSchema;

const userValidator = (schema: UserSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.details);
      return;
    }

    next();
  };
};

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(users.filter((user) => !user.isDeleted));
});

app.get("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const userToFind = find(users, (user: User) => user.id === id);

  if (!userToFind) {
    res.status(404).send("User not found");
  }

  res.status(200).json(userToFind);
});

app.post("/users", userValidator(userSchema), (req: Request, res: Response) => {
  const user = req.body as User;

  user.id = v4();
  user.isDeleted = false;

  users.push(user);

  res.status(201).json(user);
});

app.put("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { login, password, age } = req.body as User;

  const userToUpdate = find(users, (user: User) => user.id === id);

  if (!userToUpdate) {
    res.status(404).send("User is not found");
  } else {
    userToUpdate.login = login;
    userToUpdate.password = password;
    userToUpdate.age = age;

    res.status(200).json(userToUpdate);
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const userToDelete = find(users, (user: User) => user.id === id);

  if (!userToDelete || userToDelete.isDeleted) {
    res.status(404).send("User is not found");
  } else {
    userToDelete.isDeleted = true;

    res.status(204).send();
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
