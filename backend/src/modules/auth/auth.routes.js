import { Router } from "express";
import { errorRes, successRes } from "../../utils/response.js";
import * as authService from "./auth.service.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { loginSchema, signupSchema } from "../../schemas/auth.schema.js";

export const authRouter = new Router();

authRouter.post("/signup", validate(signupSchema), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      phoneNumber,
      gender = 0,
      provider,
    } = req.body;
    const payload = await authService.signup({
      firstName,
      lastName,
      email,
      password,
      age,
      phoneNumber,
      gender,
      provider,
    });
    successRes({
      res,
      message: "User created successfully",
      data: payload,
      status: 201,
    });
  } catch (err) {
    errorRes({ res, message: err });
  }
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = await authService.login({ email, password });
    successRes({
      res,
      message: "logged in successfully",
      data: payload,
      status: 200,
    });
  } catch (err) {
    errorRes({ res, message: err.message });
  }
});

authRouter.get("/refresh-token", (req, res) => {
  try {
    const { authorization: refreshToken } = req.headers;
    const payload = authService.generateRefreshToken({ refreshToken });
    successRes({
      res,
      message: "Access token generated successfully",
      data: payload,
    });
  } catch (err) {
    errorRes({ res, message: err.message });
  }
});

authRouter.post("/signup/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const data = await authService.googleSignUp({ credential });
    successRes({ res, data });
  } catch (err) {
    errorRes({ res, message: err.message, status: 401 });
  }
});
