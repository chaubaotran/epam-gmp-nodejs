import express from "express";

import config from "../config";
import routes from "../api";
import {
  controllerErrorsHandlingMiddleware,
  unhandledErrorsHandlingMiddleware,
  wrongUrlErrorHandlingMiddleware,
} from "../api/middlewares/error-handling.middleware";
import { httpLoggingMiddleware } from "../api/middlewares/http-logging.middleware";
import { logger } from "../shared/logger";

const app = express();
app.use(express.json());

app.use(httpLoggingMiddleware);

app.use("/api/users", routes.userRouter);
app.use("/api/groups", routes.groupRouter);
app.all("*", wrongUrlErrorHandlingMiddleware, routes.groupRouter);

app.use(controllerErrorsHandlingMiddleware);
app.use(unhandledErrorsHandlingMiddleware);

export default () => {
  app.listen(config.port, () => logger.info("app is running on port 3000"));
};
