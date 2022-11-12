import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  backUpImage: {
    type: String,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = model("User", userSchema, "users");
