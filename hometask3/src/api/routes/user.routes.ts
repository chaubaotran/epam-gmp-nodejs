import { Router } from "express";

import userValidator from "../middlewares/userValidator";

import UserController from "../../controllers/user.controller";

const router = Router();

router.get("/", UserController.getUsers);

router.get("/:id", UserController.getUserById);

router.post("/", userValidator, UserController.createUser);

router.put("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUserById);

export default router;
