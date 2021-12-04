import { Request, Response } from "express";

import { GroupService } from "../services/group.service";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dtos/group";
import { ControllerLogger } from "../helpers/controller.logger";

export default class GroupController {
  @ControllerLogger()
  public static async getGroups(req: Request, res: Response): Promise<void> {
    const groups = await GroupService.getGroups();
    res.status(200).json(groups);
  }

  @ControllerLogger()
  public static async getGroupById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const group = await GroupService.getGroupById(id);
    res.status(200).json(group);
  }

  @ControllerLogger()
  public static async createGroup(req: Request, res: Response): Promise<void> {
    const createGroupRequestDto = req.body as CreateGroupRequestDto;
    const createdGroup = await GroupService.createGroup(createGroupRequestDto);
    res.status(201).json(createdGroup);
  }

  @ControllerLogger()
  public static async updateGroup(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateGroupRequestDto = req.body as UpdateGroupRequestDto;
    const updatedGroup = await GroupService.updateGroup(
      id,
      updateGroupRequestDto
    );
    res.status(200).json(updatedGroup);
  }

  @ControllerLogger()
  public static async deleteGroup(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const numberOfDeletedRecords = await GroupService.deleteGroup(id);
    res.status(200).send(`Deleted ${numberOfDeletedRecords} group(s).`);
  }

  @ControllerLogger()
  public static async addUsersToGroup(
    req: Request,
    res: Response
  ): Promise<void> {
    const groupId = req.params.id;
    const userIds = req.body.userIds;
    const users = await GroupService.addUsersToGroup(groupId, userIds);
    res.status(201).send(users);
  }
}
