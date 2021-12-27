import { NextFunction } from "express";
import request from "supertest";

import app from "../loaders/express";
import { UserService } from "../services/user.service";
import { authenticationMiddleware } from "../api/middlewares/auth.middlewares";
import { httpLoggingMiddleware } from "../api/middlewares/http-logging.middleware";
import { CreateUserRequestDto, UpdateUserRequestDto } from "../dtos/user";
import { NotFoundError } from "../shared/error";
import { ErrorMessages } from "../shared/enum";

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
jest.mock("../services/user.service");

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

describe("CHECKING USER CONTROLLER", () => {
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

  describe("[GET] /api/users", () => {
    describe("when passing no params", () => {
      it("should return 200 with a list of users", async () => {
        (UserService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

        return request(app)
          .get(`/api/users`)
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject(mockUsers);
          });
      });
    });

    describe("when params are passed", () => {
      it("should return 200 with a list of users", async () => {
        (UserService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

        const loginSubstring = "e";
        const limit = "2";

        return request(app)
          .get(`/api/users?loginSubstring=${loginSubstring}&limit=${limit}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject(mockUsers);
          });
      });
    });

    it("should return status 404 with error in body if no users found", async () => {
      (UserService.getUsers as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.USERS_NOT_FOUND);
      });

      return request(app)
        .get(`/api/users`)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.USERS_NOT_FOUND,
          });
        });
    });
  });

  describe("[GET] /api/users/:id", () => {
    it("should return 200 with a list of the requested id", async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUsers[0]);

      return request(app)
        .get(`/api/users/b4c7010c-1aa4-4a79-a56d-c807a231e98a`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(mockUsers[0]);
        });
    });

    it("should return status 404 with error in body if no users with the requested id found", async () => {
      (UserService.getUserById as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .get(`/api/users/123`)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.USER_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });

  describe("[POST] /api/users", () => {
    it("should return 201 with created user detail", async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue(mockUsers[0]);

      const userDto: CreateUserRequestDto = {
        login: "Phan De",
        password: "de123",
        age: 33,
      };

      return request(app)
        .post(`/api/users`)
        .send(userDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject(mockUsers[0]);
        });
    });

    it("should return 400 when password format is incorrect", async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue(mockUsers[0]);

      const userDto: CreateUserRequestDto = {
        login: "Phan De",
        password: "de",
        age: 33,
      };

      return request(app).post(`/api/users`).send(userDto).expect(400);
    });

    it("should return 400 when user payload lacks login property", async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue(mockUsers[0]);

      const userDto = {
        password: "de",
        age: 33,
      };

      return request(app).post(`/api/users`).send(userDto).expect(400);
    });
  });

  describe("[PUT] /api/users/:id", () => {
    it("should return 200 with updated user detail", async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue(mockUsers[0]);

      const userDto: UpdateUserRequestDto = {
        login: "Phan De",
        password: "de456",
        age: 33,
      };

      return request(app)
        .put(`/api/users/b4c7010c-1aa4-4a79-a56d-c807a231e98a`)
        .send(userDto)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(mockUsers[0]);
        });
    });

    it("should return 404 if no users with the requested id found", async () => {
      (UserService.updateUser as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
      });

      const userDto: UpdateUserRequestDto = {
        login: "Phan De",
        password: "de456",
        age: 33,
      };

      return request(app)
        .put(`/api/users/123`)
        .send(userDto)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty("error");
          expect(response.body).toMatchObject({
            error: ErrorMessages.USER_WITH_THE_ID_NOT_FOUND,
          });
        });
    });
  });

  describe("[DELETE] /api/users/:id", () => {
    it("should return 200 with number of deleted users", async () => {
      const mockDeletedUserNumber = 1;
      const expectedResult = `Deleted ${mockDeletedUserNumber} user(s).`;
      (UserService.deleteUserById as jest.Mock).mockResolvedValue(
        mockDeletedUserNumber
      );

      return request(app)
        .delete(`/api/users/b4c7010c-1aa4-4a79-a56d-c807a231e98a`)
        .expect(200)
        .then((response) => {
          expect(response.text).toEqual(expectedResult);
        });
    });

    it("should return 404 if no users with the requested id found", async () => {
      (UserService.deleteUserById as jest.Mock).mockImplementation(() => {
        throw new NotFoundError(ErrorMessages.USER_WITH_THE_ID_NOT_FOUND);
      });

      return request(app)
        .delete(`/api/users/123`)
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
