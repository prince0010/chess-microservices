import { ILog } from "@/modules/log/interfaces"
import { Schema, model, models } from "mongoose"

const Log = new Schema<ILog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    action: {
      type: String,
      required: [true, "Description is required."],
    },
  },
  { timestamps: true }
)

export default models.Log || model<ILog>("Log", Log)
