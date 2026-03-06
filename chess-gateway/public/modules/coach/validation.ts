import { z } from "zod";
import { ChessTitle } from "./interface";

const ChessTitleZodEnum = z.nativeEnum(ChessTitle);

export const CoachSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" })
        .trim(),

    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" })
        .trim(),

    phoneNumber: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(20, { message: "Phone number must be less than 20 digits" })
        .regex(/^[\+]?[1-9][\d]{0,15}$/, {
            message: "Please enter a valid phone number",
        }),

    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .trim(),

    fideId: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => !val || /^\d+$/.test(val),
            { message: "FIDE ID must contain only numbers" }
        ),

    chessTitle: ChessTitleZodEnum
        .optional()
        .default(ChessTitle.NONE),

    photo: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 2 * 1024 * 1024,
            { message: "Photo must be less than 2MB" }
        )
        .refine(
            (file) => !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            { message: "Photo must be a JPG or PNG image" }
        ),

    hasStudentsOnApp: z
        .boolean(),

    wantsToBeListed: z
        .boolean(),

    cvFile: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            { message: "CV file must be less than 5MB" }
        )
        .refine(
            (file) =>
                ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                    .includes(file.type),
            { message: "CV must be a PDF or Word document" }
        ),

    languages: z
        .array(z.string().min(1, { message: "Language cannot be empty" }))
        .min(1, { message: "At least one language is required" })
        .max(10, { message: "Maximum 10 languages allowed" }),
});

export type CoachFormValues = z.infer<typeof CoachSchema>;