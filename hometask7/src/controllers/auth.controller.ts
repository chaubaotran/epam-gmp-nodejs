import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import { ControllerLogger } from "../helpers/controller.logger";
import { UserService } from "../services/user.service";

export default class AuthController {
  @ControllerLogger()
  public static async login(req: Request, res: Response): Promise<void> {
    const { login, password } = req.body;

    const user = await UserService.authenticateUser(login, password);

    if (user) {
      const token = jwt.sign(user.toJSON(), config.tokenSecet, {
        expiresIn: config.tokenExpireTime,
      });
      res.status(200).json({ token, user });
    }
  }
}
