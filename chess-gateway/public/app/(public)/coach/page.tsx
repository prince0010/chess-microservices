"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, X, Plus, Crown, Loader2, Clock, CheckCircle } from "lucide-react"
import Header from "@/components/custom/header"
import Footer from "@/components/custom/footer"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Import the interface from your module
import { ChessTitle } from "@/modules/coach/interface"
import { useCreateCoach } from "@/modules/coach/hooks"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { PhoneInput } from "@/lib/country-codes"

export const CHESS_TITLE_OPTIONS = [
    { value: ChessTitle.NONE, label: "None" },
    { value: ChessTitle.WORLD_CHAMPION, label: "World Champion" },
    { value: ChessTitle.GRANDMASTER, label: "Grandmaster (GM)" },
    { value: ChessTitle.WOMAN_GRANDMASTER, label: "Woman Grandmaster (WGM)" },
    { value: ChessTitle.INTERNATIONAL_MASTER, label: "International Master (IM)" },
    { value: ChessTitle.WOMAN_INTERNATIONAL_MASTER, label: "Woman International Master (WIM)" },
    { value: ChessTitle.FIDE_MASTER, label: "FIDE Master (FM)" },
    { value: ChessTitle.WOMAN_FIDE_MASTER, label: "Woman FIDE Master (WFM)" },
    { value: ChessTitle.CANDIDATE_MASTER, label: "Candidate Master (CM)" },
    { value: ChessTitle.WOMAN_CANDIDATE_MASTER, label: "Woman Candidate Master (WCM)" },
    { value: ChessTitle.ARENA_GRANDMASTER, label: "Arena Grandmaster (AGM)" },
    { value: ChessTitle.WOMAN_ARENA_GRANDMASTER, label: "Woman Arena Grandmaster (WAGM)" },
    { value: ChessTitle.ARENA_INTERNATIONAL_MASTER, label: "Arena International Master (AIM)" },
    { value: ChessTitle.WOMAN_ARENA_INTERNATIONAL_MASTER, label: "Woman Arena International Master (WAIM)" },
    { value: ChessTitle.ARENA_FIDE_MASTER, label: "Arena FIDE Master (AFM)" },
    { value: ChessTitle.WOMAN_ARENA_FIDE_MASTER, label: "Woman Arena FIDE Master (WAFM)" },
]

// Create a custom file schema that works with TypeScript
const fileSchema = z.custom<File>(
    (val) => val instanceof File,
    { message: "Please upload a file" }
)

const photoFileSchema = fileSchema
    .optional()
    .refine(
        (file) => !file || file.size <= 5 * 1024 * 1024,
        { message: "Photo must be less than 5MB" }
    )
    .refine(
        (file) => !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        { message: "Photo must be a JPG or PNG image" }
    )

const cvFileSchema = fileSchema
    .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        { message: "CV file must be less than 5MB" }
    )
    .refine(
        (file) =>
            ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                .includes(file.type),
        { message: "CV must be a PDF or Word document" }
    )

// Create Zod enum from ChessTitle enum
const ChessTitleZodEnum = z.nativeEnum(ChessTitle);

// Form validation schema - Make chessTitle required with default
const CoachApplicationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email address"),
    fideId: z.string().optional().or(z.literal("")),
    chessTitle: ChessTitleZodEnum.default(ChessTitle.NONE),
    photo: photoFileSchema,
    hasStudentsOnApp: z.enum(["yes", "no"]),
    wantsToBeListed: z.enum(["yes", "no"]),
    cvFile: cvFileSchema,
    languages: z.array(z.string()).min(1, "Please add at least one language"),
})

// Infer the type from the schema
type CoachApplicationFormValues = z.infer<typeof CoachApplicationSchema>;

export default function CoachApplicationPage() {
    const { data: session } = useSession()
    const [languages, setLanguages] = useState<string[]>([""])
    const [photoPreview, setPhotoPreview] = useState<string>("")
    const [cvFileName, setCvFileName] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const router = useRouter()
    const [createCoach] = useCreateCoach();

    const form = useForm<CoachApplicationFormValues>({
        resolver: zodResolver(CoachApplicationSchema) as any,
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            fideId: "",
            chessTitle: ChessTitle.NONE,
            hasStudentsOnApp: "no",
            wantsToBeListed: "yes",
            languages: [],
        },
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("photo", file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("cvFile", file)
            setCvFileName(file.name)
        }
    }

    const addLanguageField = () => {
        setLanguages([...languages, ""])
    }

    const removeLanguageField = (index: number) => {
        if (languages.length > 1) {
            const newLanguages = languages.filter((_, i) => i !== index)
            setLanguages(newLanguages)
            const currentLanguages = form.getValues("languages") || []
            const updatedLanguages = currentLanguages.filter((_, i) => i !== index)
            form.setValue("languages", updatedLanguages)
        }
    }

    const updateLanguage = (index: number, value: string) => {
        const newLanguages = [...languages]
        newLanguages[index] = value
        setLanguages(newLanguages)
        const nonEmptyLanguages = newLanguages.filter(lang => lang.trim() !== "")
        form.setValue("languages", nonEmptyLanguages)
    }

    const onSubmit = async (data: CoachApplicationFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting your application...");

        try {
            let photoBase64: string | null = null;
            let cvBase64: string | null = null;

            const fileToBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            };

            if (data.photo) {
                photoBase64 = await fileToBase64(data.photo);
            }

            if (data.cvFile) {
                cvBase64 = await fileToBase64(data.cvFile);
            }

            if (!cvBase64) {
                throw new Error("CV file is required");
            }

            const mutationInput = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                fideId: data.fideId || "",
                chessTitle: data.chessTitle,
                hasStudentsOnApp: data.hasStudentsOnApp,
                wantsToBeListed: data.wantsToBeListed,
                languages: data.languages.filter(lang => lang.trim() !== ""),
            };

            const { data: response } = await createCoach({
                variables: {
                    input: mutationInput,
                    photo: photoBase64,
                    cvFile: cvBase64,
                },
            });

            if (response?.createCoach?.ok) {
                toast.dismiss(toastId);
                setShowSuccessModal(true);

                form.reset({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    fideId: "",
                    chessTitle: ChessTitle.NONE,
                    hasStudentsOnApp: "no",
                    wantsToBeListed: "yes",
                    languages: [],
                });
                setLanguages([""]);
                setPhotoPreview("");
                setCvFileName("");
            } else {
                throw new Error(response?.createCoach?.message || "Submission failed");
            }

        } catch (error: any) {
            console.error("Submission error:", error);

            let errorMessage = "There was an error submitting your application. Please try again.";

            if (error.message.includes("email already exists") || error.message.includes("duplicate key error")) {
                errorMessage = "This email address is already registered. Please use a different email.";
            } else if (error.message.includes("FIDE ID")) {
                errorMessage = "This FIDE ID is already registered. Please check your FIDE ID.";
            } else if (error.message.includes("file")) {
                errorMessage = "File upload failed. Please check file size and format.";
            }

            toast.error("❌ Submission Failed", {
                id: toastId,
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        form.reset({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            fideId: "",
            chessTitle: ChessTitle.NONE,
            hasStudentsOnApp: "no",
            wantsToBeListed: "yes",
            languages: [],
        });
        setLanguages([""]);
        setPhotoPreview("");
        setCvFileName("");

        toast.info("Form Cleared", {
            description: "All form fields have been reset.",
            duration: 3000,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
            <Header isLoggedIn={!!session} />

            <section className="relative py-12 px-4 min-h-[calc(100vh-140px)]">
                <div className="absolute bottom-10 right-10 w-24 h-24 opacity-10">
                    <Crown className="w-full h-full text-orange-500" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 mb-6 shadow-lg">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600">
                            Welcome to We Chess
                        </h1>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Join our international academy to teach and inspire the next generation of players.
                        </p>
                    </div>

                    <Card className="border-2 border-white shadow-2xl backdrop-blur-sm bg-white/90">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                                    Status: Pending Review
                                </span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Chess Coach Application Form
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Please fill out all required fields to apply as a chess coach. Fields marked with * are required.
                                Your application will be reviewed by our team.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        First Name *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your first name"
                                                            {...field}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Last Name *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your last name"
                                                            {...field}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Phone Number *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <PhoneInput
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Phone number"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Email *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="you@example.com"
                                                            type="email"
                                                            {...field}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="fideId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">FIDE ID (if available)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your FIDE ID"
                                                            {...field}
                                                            value={field.value || ""}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="chessTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Chess Title</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                                                                <SelectValue placeholder="Select your chess title" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {CHESS_TITLE_OPTIONS.map((title) => (
                                                                <SelectItem key={title.value} value={title.value}>
                                                                    {title.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="space-y-4">
                                        <Label className="text-gray-700">Photo (Optional)</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {photoPreview ? (
                                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                                        <Image
                                                            src={photoPreview}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover"
                                                            sizes="128px"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setPhotoPreview("")
                                                                form.setValue("photo", undefined)
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 z-10"
                                                            disabled={isSubmitting}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} bg-gradient-to-br from-orange-50 to-blue-50 transition-all duration-200`}>
                                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-600">Upload Photo</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handlePhotoChange}
                                                            disabled={isSubmitting}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <p>• Recommended size: 400x400px</p>
                                                <p>• Max file size: 5MB</p>
                                                <p>• Formats: JPG, PNG</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown Questions */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="hasStudentsOnApp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Do you have students using the We Chess APP? *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                                <SelectValue placeholder="Select Yes or No" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="yes">Yes</SelectItem>
                                                            <SelectItem value="no">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="wantsToBeListed"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">
                                                        Do you want to be presented as a Chess Coach on www.we-chess.com? *
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                                <SelectValue placeholder="Select Yes or No" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="yes">Yes</SelectItem>
                                                            <SelectItem value="no">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* CV Section */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="inline-flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 shadow-md">
                                                <span className="text-sm font-semibold">
                                                    CV + Please tell us more about your experience as a chess coach *
                                                    <span className="text-red-500 ml-1">*</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 ml-1">
                                                Upload your CV file below to share your coaching experience, achievements, and qualifications
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-gray-700">
                                                Upload CV (Word/PDF) *
                                                <span className="text-red-500 ml-1">*</span>
                                            </Label>
                                            <div className="flex items-center gap-4">
                                                <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} bg-white transition-all duration-200`}>
                                                    <Upload className="w-5 h-5 text-blue-500" />
                                                    <span className="text-sm font-medium text-gray-700">Choose File</span>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        onChange={handleCvChange}
                                                        disabled={isSubmitting}
                                                    />
                                                </label>
                                                {cvFileName && (
                                                    <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-orange-50 to-blue-50 px-3 py-2 rounded-lg">
                                                        <span className="text-gray-800 font-medium">{cvFileName}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCvFileName("")
                                                                form.setValue("cvFile", undefined as any)
                                                            }}
                                                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                            disabled={isSubmitting}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                • Max file size: 5MB • Accepted formats: PDF, DOC, DOCX
                                            </p>
                                            {form.formState.errors.cvFile && (
                                                <p className="text-sm text-red-500">{form.formState.errors.cvFile.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div className="space-y-4">
                                        <Label className="text-gray-700">
                                            Languages in which you can provide chess lessons *
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <div className="space-y-3">
                                            {languages.map((language, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g., English, Spanish, French, etc."
                                                        value={language}
                                                        onChange={(e) => updateLanguage(index, e.target.value)}
                                                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        disabled={isSubmitting}
                                                    />
                                                    {languages.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeLanguageField(index)}
                                                            className="border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                            disabled={isSubmitting}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addLanguageField}
                                            className="flex items-center gap-2 border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Another Language
                                        </Button>
                                        {form.formState.errors.languages && (
                                            <p className="text-sm text-red-500">{form.formState.errors.languages.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-gradient-to-r from-blue-600 hover:scale-105 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-md font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Application"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleClear}
                                            disabled={isSubmitting}
                                            className="flex-1 py-6 text-md font-medium border-gray-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                                        >
                                            Clear Form
                                        </Button>
                                    </div>

                                    {/* <div className="text-center text-sm text-gray-600 pt-4">
                                        <p className="bg-white/50 backdrop-blur-sm py-2 px-4 rounded-lg inline-block">
                                            By submitting this application, you agree to our{" "}
                                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                Privacy Policy
                                            </a>
                                        </p>
                                    </div> */}
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Application Submitted Successfully!</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Your coach application has been submitted and is now pending review. <br />
                            We`&quot;`ll notify you once it`&quot;`s been processed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                            <Clock className="inline w-4 h-4 mr-1" />
                            Current Status: <span className="font-semibold">Pending Review</span>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            You can now close this window or return to the homepage.
                        </p>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push("/");
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700"
                        >
                            Return to Home
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Stay on Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer variant="training" />
        </div>
    )
}