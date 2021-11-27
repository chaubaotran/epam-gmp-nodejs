import { ErrorNames } from "./enum";

export class BaseError extends Error {
  constructor(error: Error) {
    super();
    this.name = error.name;
    this.message = error.message;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.name = ErrorNames.NOT_FOUND;
    this.message = message;
  }
}
