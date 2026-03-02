import { create, findByEmail, findOne } from "../../db/db.repo.js";
import { userModel } from "../../models/user/user.model.js";
import * as argon2 from "argon2";
import {
  generateToken,
  decodeToken,
  generateTokens,
} from "../../utils/token.js";
import { OAuth2Client } from "google-auth-library";
import { PROVIDER } from "../../enums/user.enum.js";

const client = new OAuth2Client();

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  age,
  phoneNumber,
  gender,
  provider,
}) => {
  const hashedPassword = password ? await argon2.hash(password) : undefined;
  const user = await create({
    model: userModel,
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      phoneNumber,
      gender,
      provider,
    },
  });
  if (!user) throw new Error("Something wrong in creating user");
  // sendMail({ email: user.email, fullName: user.firstName });
  return user;
};

export const login = async ({ email, password }) => {
  const user = await findOne({ model: userModel, filter: { email } });
  if (user.provider == PROVIDER.google)
    throw new Error(
      "this account is associated with google. Try signin with google option",
    );

  if (
    !user ||
    !user.password ||
    !(await argon2.verify(user.password, password))
  )
    throw new Error("Invalid Credentials");

  const accessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    role: user.role,
    options: { expiresIn: "30M" },
  });

  const refreshToken = generateToken({
    payload: { _id: user._id, role: user.role },
    role: user.role,
    options: { expiresIn: "1W" },
    tokenType: "refresh",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const generateRefreshToken = ({ refreshToken }) => {
  const user = decodeToken({ token: refreshToken, tokenType: "refresh" });
  if (!user) throw new Error("user not found!");
  const accessToken = generateToken({
    payload: { _id: user._id },
    options: { expiresIn: "1W" },
    tokenType: "access",
  });
  return {
    accessToken,
  };
};

export const googleSignUp = async ({ credential }) => {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.CLIENT_ID,
  });

  const {
    email,
    given_name: firstName,
    family_name: lastName,
    email_verified: isEmailConfirmed,
    picture,
  } = ticket.getPayload();

  const existingUser = await findByEmail({ model: userModel, email });

  if (existingUser?.provider === PROVIDER.system)
    throw new Error("This account uses Saraha login. Use the login form instead.");

  const user =
    existingUser ??
    (await create({
      model: userModel,
      data: {
        firstName,
        lastName,
        email,
        isEmailConfirmed,
        picture,
        provider: PROVIDER.google,
      },
    }));

  return generateTokens({ id: user._id, role: user.role });
};
