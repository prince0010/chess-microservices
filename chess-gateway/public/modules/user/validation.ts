import { Roles } from "@/lib/enums"
import { z } from "zod"

export const UserSchema = z.object({
  firstName: z.string().nonempty({ message: "First Name is required." }).trim(),
  lastName: z.string().nonempty({ message: "Last Name is required." }).trim(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." })
    .trim(),
  role: z.enum(Roles).nonoptional("Please select a role."),
  status: z.boolean().default(true).optional(),
  isActive: z.boolean().default(true).optional(),
})