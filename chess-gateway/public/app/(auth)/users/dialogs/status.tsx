"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { useChangeUserStatus, useFetchUser } from "@/modules/user/hooks"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const StatusDialog = ({
    id,
    refetch,
    open: externalOpen,
    onOpenChange: externalOnOpenChange
}: {
    id?: string
    refetch?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const [updateStatus] = useChangeUserStatus()
    const { data, loading } = useFetchUser(id || undefined)
    const user = data?.fetchUser

    // Use external state if provided, otherwise use internal state
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange || setInternalOpen

    const onSubmit = () =>
        startTransition(async () => {
            try {
                const res = await updateStatus({
                    variables: {
                        input: {
                            _id: id,
                            status: !user?.status
                        }
                    },
                })

                if (res.error) {
                    console.error("GraphQL error:", res.error)
                    toast.error(res.error.message || "Failed to change status")
                    return
                }

                if (res.data?.changeUserStatus) {
                    const result = res.data.changeUserStatus
                    if (result.ok) {
                        toast.success(result.message)
                        refetch?.()
                        setOpen(false)
                    } else {
                        toast.error(result.message || "Failed to change status")
                    }
                }
            } catch (error: any) {
                console.error("Unexpected error:", error)
                toast.error("Network error occurred")
            }
        })

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            {/* Only show DialogTrigger when not controlled externally */}
            {externalOpen === undefined && (
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Change Status
                    </DropdownMenuItem>
                </DialogTrigger>
            )}
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle>
                        {user?.status ? "Deactivate" : "Activate"} User: {user?.firstName}{" "}
                        {user?.lastName}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {user?.status ? "deactivate" : "activate"}{" "}
                        this user?{" "}
                        {user?.status ? "They will no longer be able to access the system." : "They will be able to access the system again."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onSubmit}
                        disabled={isPending}
                        variant={user?.status ? "destructive" : "default"}
                    >
                        {isPending ? "Updating..." : user?.status ? "Deactivate" : "Activate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default StatusDialog