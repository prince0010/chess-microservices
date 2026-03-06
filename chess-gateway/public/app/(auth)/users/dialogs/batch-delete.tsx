import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useDeleteMultipleUsers } from "@/modules/user/hooks";

interface BatchDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIds: string[];
    onSuccess: () => void;
    refetch: () => void;
}

const BatchDeleteDialog = ({
    open,
    onOpenChange,
    selectedIds,
    onSuccess,
    refetch,
}: BatchDeleteDialogProps) => {
    const [deleteMultipleUsers] = useDeleteMultipleUsers();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            setIsDeleting(true);

            // Call the batch delete mutation
            const { data, error: errors } = await deleteMultipleUsers({
                variables: {
                    ids: selectedIds
                }
            });

            console.log("Mutation response:", { data, errors });

            if (errors) {
                console.error("GraphQL errors:", errors);
                throw new Error(errors?.message || "GraphQL error occurred");
            }

            if (data?.deleteMultipleUsers?.ok) {
                console.log("Successfully deleted users:", selectedIds);

                onSuccess();
                refetch();

                onOpenChange(false);
            } else {
                throw new Error(data?.deleteMultipleUsers?.message || "Failed to delete users");
            }
        } catch (error) {
            console.error("Error deleting users:", error);
            // You might want to show an error toast here
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Multiple Users</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {selectedIds.length} user{selectedIds.length > 1 ? 's' : ''}?
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            "Deleting..."
                        ) : (
                            <>
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                Delete {selectedIds.length} User{selectedIds.length > 1 ? 's' : ''}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BatchDeleteDialog;