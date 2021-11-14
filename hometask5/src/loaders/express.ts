import express from "express";

import config from "../config";
import routes from "../api";
import {
  unhandledErrorsHandlingMiddleware,
  wrongUrlErrorHandlingMiddleware,
} from "../api/middlewares/errorHandler";
import { serviceMethodLoggingMiddleware } from "../api/middlewares/logger";

const app = express();
app.use(express.json());

app.use(serviceMethodLoggingMiddleware);

app.use("/api/users", routes.userRouter);
app.use("/api/groups", routes.groupRouter);
app.all("*", wrongUrlErrorHandlingMiddleware, routes.groupRouter);

app.use(unhandledErrorsHandlingMiddleware);

export default () => {
  app.listen(config.port, () => console.log("app is running on port 3000"));
};
