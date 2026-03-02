import jwt from "jsonwebtoken";
import { userModel } from "../models/user/user.model.js";
import { findOne } from "../db/db.repo.js";
import { ROLE } from "../enums/user.enum.js";

export const generateToken = ({
  payload,
  role = ROLE.user,
  options = {},
  tokenType = "access",
}) => {
  try {
    let secretKey = "";

    switch (tokenType) {
      case "access": {
        secretKey =
          role == ROLE.user
            ? process.env.USER_ACCESS_TOKEN_SIGNATURE
            : process.env.ADMIN_ACCESS_TOKEN_SIGNATURE;
        break;
      }
      case "refresh": {
        secretKey =
          role == ROLE.user
            ? process.env.USER_REFRESH_TOKEN_SIGNATURE
            : process.env.ADMIN_REFRESH_TOKEN_SIGNATURE;
        break;
      }
      default:
        throw new Error("Invalid token type");
    }
    return jwt.sign(payload, secretKey, options);
  } catch (err) {
    throw new Error(err);
  }
};

export const verifyToken = ({
  token,
  role = ROLE.user,
  tokenType = "access",
}) => {
  try {
    let secretKey = "";
    switch (tokenType) {
      case "access": {
        secretKey =
          role == ROLE.user
            ? process.env.USER_ACCESS_TOKEN_SIGNATURE
            : process.env.ADMIN_ACCESS_TOKEN_SIGNATURE;
        break;
      }
      case "refresh": {
        secretKey =
          role == ROLE.user
            ? process.env.USER_REFRESH_TOKEN_SIGNATURE
            : process.env.ADMIN_REFRESH_TOKEN_SIGNATURE;
        break;
      }
      default:
        throw new Error("Invalid token type");
    }
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error(err);
  }
};

export const decodeToken = async ({ token, tokenType = "access" }) => {
  try {
    const decodedUser = jwt.decode(token);
    const payload = verifyToken({ token, role: decodeToken.role, tokenType });
    const user = await findOne({
      model: userModel,
      filter: { _id: payload._id },
      select: "firstName lastName email role gender",
    });
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

export const generateTokens = ({ id, role }) => {
  const accessToken = generateToken({
    payload: { _id: id, role: role },
    role: role,
    options: { expiresIn: "30M" },
  });
  const refreshToken = generateToken({
    payload: { _id: id, role: role },
    role: role,
    options: { expiresIn: "1W" },
    tokenType: "refresh",
  });

  return {
    accessToken,
    refreshToken,
  };
};
