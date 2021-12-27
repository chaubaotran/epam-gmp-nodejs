import { NextFunction } from "express";
import request from "supertest";

import app from "../loaders/express";
import { authenticationMiddleware } from "../api/middlewares/auth.middlewares";
import { httpLoggingMiddleware } from "../api/middlewares/http-logging.middleware";
import { NotFoundError } from "../shared/error";
import { ErrorMessages, Permissions } from "../shared/enum";
import { GroupService } from "../services/group.service";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dtos/group";

jest.mock("../api/middlewares/http-logging.middleware");
jest.mock("../api/middlewares/auth.middlewares");
jest.mock("../helpers/controller.logger", () => ({
  ControllerLogger:
    () =>
    (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor => {
      const originalMethod = descriptor.value;

      if (typeof originalMethod === "function") {
        descriptor.value = async (...args: any) => {
          try {
            await originalMethod.apply(this, args);
          } catch (error) {
            const [, , next] = args;
            next(error);
          }
        };
      }

      return descriptor;
    },
}));
jest.mock("../services/group.service");

const mockGroups = [
  {
    id: "fa195eed-6a50-469c-8438-f7860eaf9ca1",
    name: "A1",
    permissions: [Permissions.READ, Permissions.WRITE, Permissions.DELETE],
  },
  {
    id: "fa195eed-6a50-469c-8438-f7860eaf9ca2",
    name: "A2",
    permissions: [Permissions.READ],
  },
];

const mockUsers = [
  {
    id: "b4c7010c-1aa4-4a79-a56d-c807a231e98a",
    login: "Phan De",
    password: "de123",
    age: 33,
    isDeleted: false,
  },
  {
    id: "301e8e2b-09fc-43d4-8a67-c3ea673f109e",
    login: "Nguyen Linh",
    password: "linh123",
    age: 31,
    isDeleted: false,
  },
];

describe("CHECKING GROUP CONTROLLER", () => {
  beforeAll(() => {
    (httpLoggingMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => next()
    );
  });

  beforeAll(() => {
    (authenticationMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => next()
    );
  });

  describe("[GET] /api/groups", () => {
    it("should return 200 with a list of groups", async () => {
      (GroupService.getGroups as jest.Mock).mockResolvedValue(mockGroups);

      return request(app)
        .get(`/api/groups`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(mockGroups);
        });
    });

    it("should return status 404 with error in body if no group found", async () => {
      (GroupService.getGroups as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.GROUPS_NOT_FOUND);
      });

      return request(app)
        .get(`/api/groups`)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.GROUPS_NOT_FOUND,
          });
        });
    });
  });

  describe("[GET] /api/groups/:id", () => {
    it("should return 200 with a group of the requested id", async () => {
      (GroupService.getGroupById as jest.Mock).mockResolvedValue(mockGroups[0]);

      return request(app)
        .get(`/api/groups/fa195eed-6a50-469c-8438-f7860eaf9ca1`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(mockGroups[0]);
        });
    });

    it("should return status 404 with error in body if no groups with the requested id found", async () => {
      (GroupService.getGroupById as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .get(`/api/groups/123`)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });

  describe("[POST] /api/groups", () => {
    it("should return 201 with created groups detail", async () => {
      (GroupService.createGroup as jest.Mock).mockResolvedValue(mockGroups[0]);

      const groupDto: CreateGroupRequestDto = {
        name: "A1",
        permissions: [Permissions.READ, Permissions.WRITE, Permissions.DELETE],
      };

      return request(app)
        .post(`/api/groups`)
        .send(groupDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject(mockGroups[0]);
        });
    });

    it("should return 500 when group permissions value is incorrect", async () => {
      (GroupService.createGroup as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const groupDto = {
        name: "A1",
        permissions: ["ADD"],
      };

      return request(app).post(`/api/groups`).send(groupDto).expect(500);
    });

    it("should return 500 when group payload lacks name property", async () => {
      (GroupService.createGroup as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const groupDto = {
        permissions: ["ADD"],
      };

      return request(app).post(`/api/groups`).send(groupDto).expect(500);
    });

    it("should return 500 when group payload lacks permissions property", async () => {
      (GroupService.createGroup as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const groupDto = {
        name: "A1",
      };

      return request(app).post(`/api/groups`).send(groupDto).expect(500);
    });
  });

  describe("[PUT] /api/groups/:id", () => {
    const groupDto: UpdateGroupRequestDto = {
      name: "A1",
      permissions: [Permissions.READ],
    };

    it("should return 200 with updated group detail", async () => {
      (GroupService.updateGroup as jest.Mock).mockResolvedValue(mockGroups[0]);

      return request(app)
        .put(`/api/groups/fa195eed-6a50-469c-8438-f7860eaf9ca1`)
        .send(groupDto)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(mockGroups[0]);
        });
    });

    it("should return 404 if no groups with the requested id found", async () => {
      (GroupService.updateGroup as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .put(`/api/groups/123`)
        .send(groupDto)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });

  describe("[DELETE] /api/groups/:id", () => {
    it("should return 200 with number of deleted groups", async () => {
      const mockDeletedGroupNumber = 1;
      const expectedResult = `Deleted ${mockDeletedGroupNumber} group(s).`;
      (GroupService.deleteGroup as jest.Mock).mockResolvedValue(
        mockDeletedGroupNumber
      );

      return request(app)
        .delete(`/api/groups/fa195eed-6a50-469c-8438-f7860eaf9ca1`)
        .expect(200)
        .then((response) => {
          expect(response.text).toEqual(expectedResult);
        });
    });

    it("should return 404 if no groups with the requested id found", async () => {
      (GroupService.deleteGroup as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .delete(`/api/groups/123`)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });

  describe("[POST] /api/groups/:id/addUsers", () => {
    const userIds = [mockUsers[0].id, mockUsers[1].id];

    it("should return 201 with users detail", async () => {
      const mockUserGroup = [
        {
          id: "fa195eed-6a50-469c-8438-f7860eaf9ca2",
          userId: mockUsers[0].id,
          groupId: "fa195eed-6a50-469c-8438-f7860eaf9ca1",
        },
        {
          id: "fa195eed-6a50-469c-8438-f7860eaf9ca3",
          userId: mockUsers[1].id,
          groupId: "fa195eed-6a50-469c-8438-f7860eaf9ca1",
        },
      ];

      (GroupService.addUsersToGroup as jest.Mock).mockResolvedValue(
        mockUserGroup
      );

      return request(app)
        .post(`/api/groups/fa195eed-6a50-469c-8438-f7860eaf9ca1/addUsers`)
        .send(userIds)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject(mockUserGroup);
        });
    });

    it("should return 404 if no groups with the requested id found", async () => {
      (GroupService.addUsersToGroup as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .post(`/api/groups/123/addUsers`)
        .send(userIds)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.GROUP_WITH_THE_ID_NOT_FOUND,
          });
        });
    });

    it("should return 404 if no users with the requested id found", async () => {
      (GroupService.addUsersToGroup as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .post(`/api/groups/fa195eed-6a50-469c-8438-f7860eaf9ca1/addUsers`)
        .send(userIds)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.USER_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });
});
