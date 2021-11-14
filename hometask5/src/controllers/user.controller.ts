import { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/user";

export default class UserController {
  public static async getUsers(req: Request, res: Response): Promise<void> {
    const { loginSubstring = "", limit = 3 } = req.query;

    try {
      const users = await UserService.getUsers(
        loginSubstring as string,
        limit as number
      );
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send("No users found.");
    }
  }

  public static async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("No user with the id found.");
    }
  }

  public static async createUser(req: Request, res: Response): Promise<void> {
    const userRequestDto = req.body as CreateUserRequestDto;
    try {
      const createdUser = await UserService.createUser(userRequestDto);
      res.status(201).json(createdUser);
    } catch (error) {
      res.status(500).send("Cannot create user.");
    }
  }

  public static async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateUserRequestDto = req.body as UpdateUserRequestDto;

    try {
      const updatedUser = await UserService.updateUser(
        id,
        updateUserRequestDto
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send("Cannot update user.");
    }
  }

  public static async deleteUserById(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params.id;

    try {
      const numberOfDeletedRecords = await UserService.deleteUserById(id);
      res.status(200).send(`Deleted ${numberOfDeletedRecords} user(s).`);
    } catch (error) {
      res.status(500).send("Cannot delete user.");
    }
  }
}
