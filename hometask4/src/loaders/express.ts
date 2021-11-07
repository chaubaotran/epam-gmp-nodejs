import express from "express";

import routes from "../api";
import config from "../config";

const app = express();
app.use(express.json());

app.use("/api/users", routes.userRouter);
app.use("/api/groups", routes.groupRouter);

export default () => {
  app.listen(config.port, () => console.log("app is running on port 3000"));
};
