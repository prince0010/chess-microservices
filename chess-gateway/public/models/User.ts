// models/User.ts
import { Roles } from "@/lib/enums"
import { IUser } from "@/modules/user/interfaces"
import { model, models, Schema } from "mongoose"

const User = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: Object.values(Roles),
        message: "Select valid role.",
      },
    },
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      sparse: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default models.User || model<IUser>("User", User)