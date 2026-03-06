"use client"
import React, { useTransition } from "react"
import { Input } from "./ui/input"
import Image from "next/image"
import { IdCard } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { signIn } from "next-auth/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "./ui/button"
import { LoginSchema } from "@/modules/auth/validation"
import { useRouter } from "next/navigation"
import Clock from "./clock"
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import CryptoJS from "crypto-js"

function ForgotPasswordDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link">Forgot Password?</Button>
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

export default function Login() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
  const router = useRouter()

  const onSubmit = (payload: z.infer<typeof LoginSchema>) =>
    startTransition(async () => {
      try {
        if (!process.env.NEXT_PUBLIC_NEXTAUTH_SECRET)
          throw new Error("Network error. Please try again later.")
        const enc = CryptoJS.AES.encrypt(
          JSON.stringify(payload),
          process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
        ).toString()
        const res = await signIn("credentials", {
          enc,
          redirect: false,
        })
        if (res?.error) throw new Error(res.error)
        router.push("/applicants")
      } catch (error: any) {
        console.error(error)
        form.setError("username", {
          type: "manual",
        })
        form.setError("password", {
          type: "manual",
          message: error?.message,
        })
      }
    })

  return (
    <div className="h-screen w-full flex">
      <div className="w-full h-full bg-white flex items-center justify-center flex-col gap-4">
        <div className="flex items-center justify-end flex-col h-2/5 py-6">
          <Image src="/img/narvaicon.ico" alt="Logo" width={220} height={100} />
          <div className="flex items-center gap-2 ">
            <IdCard className="size-7" />
            <span className="font-bold uppercase block text-2xl drop-shadow">
              Narva System
            </span>
          </div>
          <div className="w-[360px] mt-2">
            <Clock
              className="w-full bg-primary text-white text-center rounded-tr-md rounded-tl-md text-sm pt-0.5 block"
              timeFormat="EEEE, MMMM dd, yyyy"
            />
            <Clock
              className="w-full text-4xl border border-primary text-center rounded-br-md rounded-bl-md font-bold block"
              timeFormat="hh:mm a"
            />
          </div>
        </div>
        <div className="w-[360px] h-2/3 flex flex-col gap-3">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-2.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="@username"
                          {...field}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending}
                          placeholder="•••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={isPending} className="mt-2">
                Sign In
              </Button>
              <ForgotPasswordDialog />
            </form>
          </Form>
        </div>
        <span className="block absolute bottom-4 text-muted-foreground">
          © 2025 Narva
        </span>
      </div>
    </div>
  )
}
