// app/login/page.tsx
"use client"

import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/modules/auth/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crown } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CryptoJS from "crypto-js"

// Update the schema to use identifier instead of username
const UpdatedLoginSchema = z.object({
    identifier: z.string().min(1, { message: "Email or username is required" }).trim(),
    password: z.string().min(1, { message: "Password is required" }).trim(),
});

function ForgotPasswordDialog() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="link" className="text-gray-400 left-0 hover:text-gray-500 hover:underline cursor-pointer font-medium">Forgot Password?</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Forgot Password?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Contact <b className="text-destructive">HR Department</b> for
                        password assistance.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function LoginPage() {
    const { data: session, status } = useSession()
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof UpdatedLoginSchema>>({
        resolver: zodResolver(UpdatedLoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })
    const router = useRouter()

    // Redirect if already logged in based on role
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const role = session.user.role;
            console.log("User already logged in with role:", role);

            if (role === "coach") {
                router.push("/coach-dashboard");
            } else if (role === "user") {
                router.push("/users-dashboard");
            } else if (role === "admin") {
                router.push("/applicants");
            }
        }
    }, [status, session, router]);

    const onSubmit = (payload: z.infer<typeof UpdatedLoginSchema>) =>
        startTransition(async () => {
            try {
                if (!process.env.NEXT_PUBLIC_NEXTAUTH_SECRET)
                    throw new Error("Network error. Please try again later.")

                const loginPayload = {
                    username: payload.identifier,
                    password: payload.password
                }

                const enc = CryptoJS.AES.encrypt(
                    JSON.stringify(loginPayload),
                    process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
                ).toString()

                const res = await signIn("credentials", {
                    enc,
                    redirect: false,
                })

                if (res?.error) throw new Error(res.error)

                // Don't redirect here - let the useEffect handle it
                // The page will automatically redirect when session updates

            } catch (error: any) {
                console.error(error)
                form.setError("identifier", {
                    type: "manual",
                })
                form.setError("password", {
                    type: "manual",
                    message: error?.message || "Invalid email/username or password",
                })
            }
        })

    return (
        <div className="min-h-screen bg-white">
            <Header isLoggedIn={!!session} />

            <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
                <div className="max-w-md mx-auto">
                    <Card className="border-2 border-gray-200 shadow-xl">
                        <CardHeader className="space-y-1 text-center">
                            <div className="flex justify-center mb-2">
                                <Crown className="w-12 h-12 text-orange-500" />
                            </div>

                            <CardTitle className="text-3xl font-bold text-gray-900">
                                Welcome Back
                            </CardTitle>

                            <CardDescription className="text-gray-600">
                                Sign in to your We Chess account to continue your journey
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex flex-col gap-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="identifier"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder=" "
                                                        disabled={isPending}
                                                        className="
                                                            peer h-12 border-gray-300
                                                            focus:border-orange-500 focus:ring-orange-500
                                                        "
                                                    />
                                                </FormControl>

                                                <FormLabel
                                                    className="
                                                        absolute left-3 -top-2
                                                        bg-white px-1
                                                        text-sm text-gray-400
                                                        transition-all duration-200
                                                        peer-placeholder-shown:top-3.5
                                                        peer-placeholder-shown:text-base
                                                        peer-focus:-top-2
                                                        peer-focus:text-xs
                                                        peer-focus:text-orange-600
                                                    "
                                                >
                                                    Email or Username
                                                </FormLabel>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder=" "
                                                        disabled={isPending}
                                                        className="
                                                            peer h-12 border-gray-300
                                                            focus:border-orange-500 focus:ring-orange-500
                                                        "
                                                    />
                                                </FormControl>

                                                <FormLabel
                                                    className="
                                                        absolute left-3 -top-2
                                                        bg-white px-1
                                                        text-sm text-gray-400
                                                        transition-all duration-200
                                                        peer-placeholder-shown:top-3.5
                                                        peer-placeholder-shown:text-base
                                                        peer-focus:-top-2
                                                        peer-focus:text-xs
                                                        peer-focus:text-orange-600
                                                    "
                                                >
                                                    Password
                                                </FormLabel>

                                                <FormMessage />

                                                <div className="flex justify-end mt-1">
                                                    <ForgotPasswordDialog />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        {isPending ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center space-y-2">
                        <p className="text-xs text-gray-500">
                            Secure login powered by We Chess
                        </p>
                    </div>
                </div>
            </section>

            <Footer variant="training" />
        </div>
    );
}