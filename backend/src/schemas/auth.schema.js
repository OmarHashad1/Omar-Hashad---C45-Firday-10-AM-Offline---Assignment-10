import joi from "joi";
import { GENDER, PROVIDER, ROLE } from "../enums/user.enum.js";
export const signupSchema = {
  body: joi.object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string(),
    role: joi.number().valid(...Object.values(ROLE)),
    gender: joi.number().valid(...Object.values(GENDER)),
    age: joi.number().min(15).max(90),
    provider: joi.number().valid(...Object.values(PROVIDER)),
    phoneNumber: joi.string(),
    picture: joi.string(),
  }),
};

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string(),
  }),
  query: joi.object({
    page: joi.number().min(1),
  }),
  params: joi.object({
    id: joi.number(),
  }),
};
