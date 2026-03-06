import { z } from "zod"

export const LoginSchema = z.object({
  username: z.string().nonempty({ message: "Username is required." }).trim(),
  password: z.string().nonempty({ message: "Password is required." }).trim(),
})

export const ChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long." })
    .max(25, { message: "New password must be at most 25 characters long." })
    .nonempty({ message: "New password is required." })
    .trim(),
})
