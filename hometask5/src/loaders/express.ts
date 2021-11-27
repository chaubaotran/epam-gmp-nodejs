import express from "express";

import config from "../config";
import routes from "../api";
import {
  unhandledErrorsHandlingMiddleware,
  wrongUrlErrorHandlingMiddleware,
} from "../api/middlewares/errorHandlingMiddleware";
import { serviceMethodLoggingMiddleware } from "../api/middlewares/loggingMiddleware";
import { logger } from "../shared/logger";

const app = express();
app.use(express.json());

app.use(serviceMethodLoggingMiddleware);

app.use("/api/users", routes.userRouter);
app.use("/api/groups", routes.groupRouter);
app.all("*", wrongUrlErrorHandlingMiddleware, routes.groupRouter);

app.use(unhandledErrorsHandlingMiddleware);

export default () => {
  app.listen(config.port, () => logger.info("app is running on port 3000"));
};
