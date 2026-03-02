import express from "express";
import { DBConnection } from "./config/db.js";
import "./models/user/user.virtuals.js";
import { userRouter } from "./modules/user/user.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { userModel } from "./models/user/user.model.js";
import cors from "cors";

export const bootstrap = async () => {
  const app = express();

  const PORT = process.env.PORT;
  await DBConnection();
  await userModel.createIndexes();

  app.use(express.json());
  app.use(cors());
  app.use("/user", userRouter);
  app.use("/auth", authRouter);

  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
};
