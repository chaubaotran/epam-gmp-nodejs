export enum Permissions {
  READ = "READ",
  WRITE = "WRITE",
  DELETE = "DELETE",
  SHARE = "SHARE",
  UPLOAD_FILES = "UPLOAD_FILES",
}

export enum ErrorNames {
  NOT_FOUND = "NotFoundError",
  SEQUELIZE_DATABASE_ERROR = "SequelizeDatabaseError",
  INCORRECT_CREDENTIALS_ERROR = "IncorrectCredentialsError",
}

export enum ErrorMessages {
  GROUPS_NOT_FOUND = "No groups are found",
  GROUP_WITH_THE_ID_NOT_FOUND = "No group with the requesting ID is found",
  USERS_NOT_FOUND = "No users are found",
  USER_WITH_THE_ID_NOT_FOUND = "No user with the requesting ID is found",
  INCORRECT_CREDENTIALS = "Your login and/or password are/is not correct",
}
