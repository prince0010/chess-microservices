// delete.tsx
"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { useDeleteUser } from "@/modules/user/hooks"
import { toast } from "sonner"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface DeleteDialogProps {
    id: string
    refetch?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    userName?: string // Optional: to show which user is being deleted
}

export default function DeleteDialog({
    id,
    refetch,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    userName
}: DeleteDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [deleteUserMutation, { loading }] = useDeleteUser()

    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const handleDelete = async () => {
        try {
            const result = await deleteUserMutation({
                variables: { _id: id }
            })

            if (result.data?.deleteUser?.ok) {
                toast.success(result.data.deleteUser.message || "User deleted successfully")
            } else {
                throw new Error(result.data?.deleteUser?.message || "Failed to delete user")
            }

            refetch?.()
            setOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Only show DialogTrigger when not controlled externally */}
            {externalOpen === undefined && (
                <DialogTrigger asChild>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                        <TrashIcon className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        {userName ? (
                            <>
                                Are you sure you want to delete <span className="font-semibold">{userName}</span>?
                                This action cannot be undone.
                            </>
                        ) : (
                            "Are you sure you want to delete this user? This action cannot be undone."
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}