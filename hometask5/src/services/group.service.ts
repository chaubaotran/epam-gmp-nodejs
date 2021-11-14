import { v4 } from "uuid";

import GroupModel from "../models/group";
import UserModel from "../models/user";
import UserGroupModel from "../models/user-group";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dtos/group";

export class GroupService {
  public static getGroups() {
    try {
      return GroupModel.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  public static getGroupById(id: string) {
    try {
      return GroupModel.findOne({
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
    } catch (error) {
      throw new Error(error);
    }
  }

  public static createGroup(createGroupRequestDto: CreateGroupRequestDto) {
    const { name, permissions } = createGroupRequestDto;

    const id = v4();

    try {
      return GroupModel.create({ id, name, permissions });
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async updateGroup(
    id: string,
    updateGroupRequestDto: UpdateGroupRequestDto
  ) {
    try {
      const groupToUpdate = await GroupModel.findByPk(id);
      if (!groupToUpdate) {
        return;
      }

      const updatedGroup = await groupToUpdate.update({
        ...updateGroupRequestDto,
      });

      return updatedGroup;
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async deleteGroup(id: string) {
    try {
      UserGroupModel.destroy({
        where: {
          groupId: id,
        },
      });

      return GroupModel.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public static async addUsersToGroup(groupId: string, userIds: string[]) {
    try {
      const group: any = await GroupModel.findOne({
        where: { id: groupId },
        include: UserModel,
      });

      if (!group) {
        return;
      }

      const users = await UserModel.findAll({
        where: {
          id: userIds,
          isDeleted: false,
        },
      });

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
    } catch (error) {
      throw new Error(error);
    }
  }
}
