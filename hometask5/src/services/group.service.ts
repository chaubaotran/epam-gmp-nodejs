import { v4 } from "uuid";

import GroupModel from "../models/group";
import UserModel from "../models/user";
import UserGroupModel from "../models/user-group";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dtos/group";
import { NotFoundError } from "../shared/error";
import { ErrorMessages } from "../shared/enum";

export class GroupService {
  public static async getGroups() {
    const groups = await GroupModel.findAll({
      include: [
        {
          model: UserModel,
          as: "users",
          attributes: ["login", "age"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (groups.length === 0) {
      throw new NotFoundError(ErrorMessages.GROUPS_NOT_FOUND);
    }

    return groups;
  }

  public static async getGroupById(id: string) {
    const group = await GroupModel.findOne({
      where: { id: id },
      include: [
        {
          model: UserModel,
          as: "users",
          attributes: ["login", "age"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!group) {
      throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
    }

    return group;
  }

  public static async createGroup(
    createGroupRequestDto: CreateGroupRequestDto
  ) {
    const { name, permissions } = createGroupRequestDto;
    const id = v4();

    return GroupModel.create({ id, name, permissions });
  }

  public static async updateGroup(
    id: string,
    updateGroupRequestDto: UpdateGroupRequestDto
  ) {
    const groupToUpdate = await GroupModel.findByPk(id);

    if (!groupToUpdate) {
      throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
    }

    return groupToUpdate.update({
      ...updateGroupRequestDto,
    });
  }

  public static async deleteGroup(id: string) {
    UserGroupModel.destroy({
      where: {
        groupId: id,
      },
    });

    const numberOfDeletedRecords = await GroupModel.destroy({
      where: {
        id: id,
      },
    });

    if (!numberOfDeletedRecords) {
      throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
    }

    return numberOfDeletedRecords;
  }

  public static async addUsersToGroup(groupId: string, userIds: string[]) {
    const group: any = await GroupModel.findOne({
      where: { id: groupId },
      include: UserModel,
    });

    if (!group) {
      throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
    }

    const users = await UserModel.findAll({
      where: {
        id: userIds,
        isDeleted: false,
      },
    });

    if (users.length === 0) {
      throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
    }

    const usersGroups = await UserGroupModel.bulkCreate(
      users.map((user) => {
        const usersGroupId = v4();

        return {
          id: usersGroupId,
          userId: user.getDataValue("id"),
          groupId: group.getDataValue("id"),
        };
      })
    );

    return usersGroups;
  }
}
