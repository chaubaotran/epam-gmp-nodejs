import { Op } from "sequelize";
import { v4 } from "uuid";

import UserModel from "../models/user";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/user";

export class UserService {
  public static getUsers(loginSubstring: string, limit: number) {
    try {
      if (!loginSubstring) {
        return UserModel.findAll({
          where: {
            isDeleted: false,
          },
        });
      }

      return UserModel.findAll({
        where: {
          login: {
            [Op.iLike]: `%${loginSubstring}%`,
          },
          isDeleted: false,
        },
        limit,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public static getUserById(id: string) {
    try {
      return UserModel.findByPk(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  public static createUser(userRequestDto: CreateUserRequestDto) {
    const { login, password, age } = userRequestDto;

    const id = v4();

    try {
      return UserModel.create({ id, login, password, age });
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async updateUser(
    id: string,
    updateUserRequestDto: UpdateUserRequestDto
  ) {
    try {
      const userToUpdate = await UserModel.findByPk(id);
      if (!userToUpdate) {
        return;
      }

      const updatedUser = await userToUpdate.update({
        ...updateUserRequestDto,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async deleteUserById(id: string) {
    try {
      const [numberOfDeletedRecords] = await UserModel.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id,
            isDeleted: false,
          },
        }
      );

      return numberOfDeletedRecords;
    } catch (error) {
      throw new Error(error);
    }
  }
}
