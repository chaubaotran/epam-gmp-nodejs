import { Op } from "sequelize";
import { v4 } from "uuid";

import UserModel from "../models/user";
import GroupModel from "../models/group";
import UserGroupModel from "../models/user-group";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/user";
import { NotFoundError } from "../shared/error";
import { ErrorMessages } from "../shared/enum";

export class UserService {
  public static async getUsers(loginSubstring: string, limit: number) {
    if (!loginSubstring) {
      const users = await UserModel.findAll({
        where: {
          isDeleted: false,
        },
      });

      if (users.length === 0) {
        throw new NotFoundError(ErrorMessages.USERS_NOT_FOUND);
      }

      return users;
    }

    const users = await UserModel.findAll({
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
        isDeleted: false,
      },
      limit,
    });

    if (users.length === 0) {
      throw new NotFoundError(ErrorMessages.USERS_NOT_FOUND);
    }

    return users;
  }

  public static async getUserById(id: string) {
    const user = await UserModel.findOne({
      where: { id: id, isDeleted: false },
      include: [
        {
          model: GroupModel,
          as: "groups",
          attributes: ["name", "permissions"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
    }

    return user;
  }

  public static async createUser(userRequestDto: CreateUserRequestDto) {
    const { login, password, age } = userRequestDto;
    const id = v4();

    return UserModel.create({ id, login, password, age });
  }

  public static async updateUser(
    id: string,
    updateUserRequestDto: UpdateUserRequestDto
  ) {
    const userToUpdate = await UserModel.findByPk(id);

    if (!userToUpdate) {
      throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
    }

    return userToUpdate.update({
      ...updateUserRequestDto,
    });
  }

  public static async deleteUserById(id: string) {
    UserGroupModel.destroy({
      where: {
        userId: id,
      },
    });

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

    if (numberOfDeletedRecords === 0) {
      throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
    }

    return numberOfDeletedRecords;
  }
}
