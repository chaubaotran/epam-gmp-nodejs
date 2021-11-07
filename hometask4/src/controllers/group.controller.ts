import { Request, Response } from "express";

import { GroupService } from "../services/group.service";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dtos/group";

export default class GroupController {
  public static async getGroups(req: Request, res: Response): Promise<void> {
    try {
      const groups = await GroupService.getGroups();
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).send("No groups found.");
    }
  }

  public static async getGroupById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const group = await GroupService.getGroupById(id);
      res.status(200).json(group);
    } catch (error) {
      res.status(500).send("No group with the id found.");
    }
  }

  public static async createGroup(req: Request, res: Response): Promise<void> {
    const createGroupRequestDto = req.body as CreateGroupRequestDto;
    try {
      const createdGroup = await GroupService.createGroup(
        createGroupRequestDto
      );
      res.status(201).json(createdGroup);
    } catch (error) {
      res.status(500).send("Cannot create group.");
    }
  }

  public static async updateGroup(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateGroupRequestDto = req.body as UpdateGroupRequestDto;

    try {
      const updatedGroup = await GroupService.updateGroup(
        id,
        updateGroupRequestDto
      );
      res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(500).send("Cannot update group.");
    }
  }

  public static async deleteGroup(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const numberOfDeletedRecords = await GroupService.deleteGroup(id);
      res.status(200).send(`Deleted ${numberOfDeletedRecords} group(s).`);
    } catch (error) {
      res.status(500).send("Cannot delete group.");
    }
  }

  public static async addUsersToGroup(
    req: Request,
    res: Response
  ): Promise<void> {
    const groupId = req.params.id;
    const userIds = req.body.userIds;

    try {
      const users = await GroupService.addUsersToGroup(groupId, userIds);

      if (!users) {
        res.status(404).send("Group does not exist");
      } else {
        res.status(201).send(users);
      }
    } catch (error) {
      res.status(500).send("Cannot add users to group.");
    }
  }
}
