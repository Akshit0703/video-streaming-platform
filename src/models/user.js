import mongoose, { Schema } from "mongoose";
import { string32 } from "pdfjs-dist/types/src/shared/util";

const userSchema = new Schema({
  username: {
    type: string,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
});
export const User = mongoose.model("User", userSchema);
