"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICoach, CoachStatus } from "@/modules/coach/interface";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface CoachStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    coach: ICoach | null;
    onStatusChange: (status: CoachStatus.VERIFIED | CoachStatus.REJECTED, rejectionReason?: string) => Promise<void>;
}

export default function CoachStatusDialog({
    isOpen,
    onClose,
    coach,
    onStatusChange,
}: CoachStatusDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!coach) return null;

    const isCurrentlyVerified = coach.status === CoachStatus.VERIFIED;
    const newStatus = isCurrentlyVerified ? CoachStatus.REJECTED : CoachStatus.VERIFIED;

    const handleStatusChange = async () => {
        if (newStatus === CoachStatus.REJECTED && !rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        setIsSubmitting(true);
        try {
            await onStatusChange(newStatus, rejectionReason || undefined);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {isCurrentlyVerified ? (
                            <>
                                <XCircle className="w-6 h-6 text-red-500" />
                                Reject Coach
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                Verify Coach
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {isCurrentlyVerified
                            ? "Are you sure you want to reject this verified coach?"
                            : "Are you sure you want to verify this coach?"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{coach.firstName} {coach.lastName}</p>
                        <p className="text-sm text-gray-600">{coach.email}</p>
                    </div>

                    {newStatus === CoachStatus.REJECTED && (
                        <div className="space-y-2">
                            <Label htmlFor="rejectionReason" className="text-red-600">
                                Rejection Reason <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="rejectionReason"
                                placeholder="Please provide a reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[100px]"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {newStatus === CoachStatus.REJECTED && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                                This coach will no longer be visible in public listings and will not be able to provide services through the platform.
                            </p>
                        </div>
                    )}

                    {newStatus === CoachStatus.VERIFIED && (
                        <div className="flex items-start gap-2 p-3 bg-green-50 text-green-800 rounded-lg">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                                This coach will be visible in public listings and will be able to provide services through the platform.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-end gap-4 sm:gap-2 w-full">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={newStatus === CoachStatus.REJECTED ? "destructive" : "default"}
                        onClick={handleStatusChange}
                        disabled={isSubmitting || (newStatus === CoachStatus.REJECTED && !rejectionReason.trim())}
                        className={newStatus === CoachStatus.VERIFIED ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isSubmitting ? (
                            "Processing..."
                        ) : newStatus === CoachStatus.REJECTED ? (
                            <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Coach
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify Coach
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}