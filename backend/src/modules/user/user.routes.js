import { Router } from "express";
import { auth,checkRole } from "../../middlewares/auth.middleware.js";
import { successRes } from "../../utils/response.js";
import { ROLE } from "../../enums/user.enum.js";

export const userRouter = new Router();

userRouter.get("/profile", auth, checkRole([ROLE.admin,ROLE.user]), (req, res) => {
  successRes({ res, data: req.user });
});
