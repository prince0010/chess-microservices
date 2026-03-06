"use client"
import React, { useState, useTransition } from "react"
import { SidebarTrigger } from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { signOut } from "next-auth/react"
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "./ui/dialog"
import { useSession } from "next-auth/react"
import { useChangePassword } from "@/modules/auth/hooks"
import { ChangePasswordSchema } from "@/modules/auth/validation"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { ObjectId } from "mongoose"
import { toast } from "sonner"

function ChangePassword({ id }: { id: ObjectId }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [changePassword] = useChangePassword()
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  })

  const onSubmit = (payload: z.infer<typeof ChangePasswordSchema>) =>
    startTransition(async () => {
      try {
        const res: any = await changePassword({
          variables: {
            _id: id,
            ...payload,
          },
        })

        if (res?.data?.changePassword?.ok) {
          toast.success(res?.data?.changePassword?.message)
          onClose()
        }
      } catch (error: any) {
        console.error(error)
      }
    })

  const onClose = () => {
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="w-full cursor-pointer hover:bg-gray-200!"
        >
          Change Password
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2.5">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isPending}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function ProfileMenu() {
  const session = useSession()
  const user = (session as any)?.data?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full cursor-pointer bg-primary/60 h-8 w-8" size="sm">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="start" side="left">
        <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ChangePassword id={user?._id} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-200!" onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Header() {
  return (
    <div className="h-11 flex items-center mt-2 justify-between px-2">
      <SidebarTrigger className="scale-140 hover:bg-gray-200 cursor-pointer" />
      <ProfileMenu />
    </div>
  )
}
