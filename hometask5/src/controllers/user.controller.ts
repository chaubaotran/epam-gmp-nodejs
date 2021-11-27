import { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/user";
import { ControllerLogger } from "../helpers/controller.logger";

export default class UserController {
  @ControllerLogger()
  public static async getUsers(req: Request, res: Response): Promise<void> {
    const { loginSubstring = "", limit = 3 } = req.query;
    const users = await UserService.getUsers(
      loginSubstring as string,
      limit as number
    );
    res.status(200).json(users);
  }

  @ControllerLogger()
  public static async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.status(200).json(user);
  }

  @ControllerLogger()
  public static async createUser(req: Request, res: Response): Promise<void> {
    const userRequestDto = req.body as CreateUserRequestDto;
    const createdUser = await UserService.createUser(userRequestDto);
    res.status(201).json(createdUser);
  }

  @ControllerLogger()
  public static async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateUserRequestDto = req.body as UpdateUserRequestDto;
    const updatedUser = await UserService.updateUser(id, updateUserRequestDto);
    res.status(200).json(updatedUser);
  }

  @ControllerLogger()
  public static async deleteUserById(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    const numberOfDeletedRecords = await UserService.deleteUserById(id);
    res.status(200).send(`Deleted ${numberOfDeletedRecords} user(s).`);
  }
}
