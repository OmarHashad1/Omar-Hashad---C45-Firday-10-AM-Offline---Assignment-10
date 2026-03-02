import mongoose from "mongoose";

export const DBConnection = async () => {
  try {
    const URI = process.env.URI;
    await mongoose.connect(URI);
    console.log("DB connected successfully");
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
