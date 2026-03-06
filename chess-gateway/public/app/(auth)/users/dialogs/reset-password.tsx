// "use client"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { useState, useTransition } from "react"
// import { useFetchUser } from "@/modules/user/hooks"
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
// import { useChangePassword } from "@/modules/auth/hooks"

// const ResetPasswordDialog = ({
//   id,
//   refetch,
// }: {
//   id?: string
//   refetch?: () => void
// }) => {
//   const [open, setOpen] = useState<boolean>(false)
//   const [isPending, startTransition] = useTransition()
//   const [changePassword] = useChangePassword()
//   const { data, loading } = useFetchUser(id || undefined)
//   const user = data?.fetchUser

//   const onSubmit = () =>
//     startTransition(async () => {
//       try {
//         const res = await changePassword({
//           variables: { _id: id, newPassword: user?.username },
//         })
//         if (res) {
//           refetch?.()
//           setOpen(false)
//         }
//       } catch (error: any) {
//         console.error(error)
//         throw new Error(error?.message || "Something went wrong.")
//       }
//     })

//   return (
//     <Dialog modal open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//           Reset Password
//         </DropdownMenuItem>
//       </DialogTrigger>
//       <DialogContent
//         onOpenAutoFocus={(e) => e.preventDefault()}
//         onInteractOutside={(e) => e.preventDefault()}
//         showCloseButton={false}
//         loading={loading}
//       >
//         <DialogHeader>
//           <DialogTitle>
//             Reset Password for: {user?.firstName} {user?.lastName}
//           </DialogTitle>
//           <DialogDescription>
//             Are you sure you want to reset the password for this user?
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline" disabled={isPending}>
//               Close
//             </Button>
//           </DialogClose>
//           <Button onClick={onSubmit} disabled={isPending}>
//             Submit
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default ResetPasswordDialog