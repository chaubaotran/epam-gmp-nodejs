import express from "express";

import routes from "../api";

const app = express();
app.use(express.json());

app.use("/api/users", routes.userRouter);

export default app;
