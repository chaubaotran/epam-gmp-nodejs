import { Router } from "express";

import GroupController from "../../controllers/group.controller";

const router = Router();

router.get("/", GroupController.getGroups);

router.get("/:id", GroupController.getGroupById);

router.post("/", GroupController.createGroup);

router.put("/:id", GroupController.updateGroup);

router.delete("/:id", GroupController.deleteGroup);

router.post("/:id/addUsers", GroupController.addUsersToGroup);

export default router;
