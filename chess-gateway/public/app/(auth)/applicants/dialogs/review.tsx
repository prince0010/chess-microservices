"use client";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ICoach as ICoachModule, CoachStatus, ChessTitle } from "@/modules/coach/interface";
import {
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Phone,
    FileCheck,
    PhilippinePeso,
    DollarSign,
    Euro,
    AlertTriangle
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CoachReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    coach: ICoachModule | null;
    onReview: (status: CoachStatus.VERIFIED | CoachStatus.REJECTED, rejectionReason?: string, price?: number, currency?: string) => Promise<void>;
}

// Currency options with symbols
const CURRENCIES = [
    { value: "USD", label: "USD", symbol: "$", icon: DollarSign },
    { value: "EUR", label: "EUR", symbol: "€", icon: Euro },
];

const CoachReviewPendingDialog = ({
    isOpen,
    onClose,
    coach,
    onReview,
}: CoachReviewDialogProps) => {
    const [rejectionReason, setRejectionReason] = useState("");
    const [price, setPrice] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priceError, setPriceError] = useState("");

    // Rejection confirmation dialog state
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRejectionReason("");
            setPrice("");
            setCurrency("USD");
            setPriceError("");
            setIsSubmitting(false);
            setIsRejectDialogOpen(false);
        }
    }, [isOpen, coach]);

    if (!coach) return null;

    const handleVerify = async () => {
        if (!price || parseFloat(price) <= 0) {
            setPriceError("Please enter a valid price greater than 0");
            return;
        }

        setIsSubmitting(true);
        try {
            await onReview(CoachStatus.VERIFIED, undefined, parseFloat(price), currency);
            onClose();
        } catch (error) {
            console.error("Error verifying coach:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectClick = () => {
        // Open the rejection confirmation dialog
        setIsRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onReview(CoachStatus.REJECTED, rejectionReason);
            setIsRejectDialogOpen(false);
            onClose();
        } catch (error) {
            console.error("Error rejecting coach:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getChessTitleLabel = (title: ChessTitle) => {
        const titleMap = {
            [ChessTitle.NONE]: "",
            [ChessTitle.WORLD_CHAMPION]: "WC",
            [ChessTitle.GRANDMASTER]: "GM",
            [ChessTitle.INTERNATIONAL_MASTER]: "IM",
            [ChessTitle.FIDE_MASTER]: "FM",
            [ChessTitle.CANDIDATE_MASTER]: "CM",
            [ChessTitle.WOMAN_GRANDMASTER]: "WGM",
            [ChessTitle.WOMAN_INTERNATIONAL_MASTER]: "WIM",
            [ChessTitle.WOMAN_FIDE_MASTER]: "WFM",
            [ChessTitle.WOMAN_CANDIDATE_MASTER]: "WCM",
            [ChessTitle.ARENA_GRANDMASTER]: "AGM",
            [ChessTitle.WOMAN_ARENA_GRANDMASTER]: "WAGM",
            [ChessTitle.ARENA_INTERNATIONAL_MASTER]: "AIM",
            [ChessTitle.WOMAN_ARENA_INTERNATIONAL_MASTER]: "WAIM",
            [ChessTitle.ARENA_FIDE_MASTER]: "AFM",
            [ChessTitle.WOMAN_ARENA_FIDE_MASTER]: "WAFM",
        };
        return titleMap[title] || title;
    };

    const SelectedCurrencyIcon = CURRENCIES.find(c => c.value === currency)?.icon || PhilippinePeso;

    return (
        <>
            {/* Main Review Dialog */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Clock className="w-6 h-6 text-yellow-500" />
                            Review Coach Application
                        </DialogTitle>
                        <DialogDescription>
                            Review the coach`&apos;`s application details and make a decision.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Coach Info */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar className="h-16 w-16">
                                {coach.photo ? (
                                    <AvatarImage src={coach.photo} alt={`${coach.firstName} ${coach.lastName}`} />
                                ) : (
                                    <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">
                                        {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">
                                    {coach.firstName} {coach.lastName}
                                </h3>
                                {coach.chessTitle && coach.chessTitle !== ChessTitle.NONE && (
                                    <Badge className="mb-2 bg-blue-100 text-blue-800">
                                        {getChessTitleLabel(coach.chessTitle)}
                                    </Badge>
                                )}
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span>{coach.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{coach.phoneNumber}</span>
                                    </div>
                                    {coach.fideId && (
                                        <div className="text-sm text-gray-600">
                                            FIDE ID: {coach.fideId}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Application Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Applied Date</p>
                                <p className="font-medium">
                                    {new Date(coach.applicationDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Wants to be Listed</p>
                                <p className="font-medium">
                                    {coach.wantsToBeListed ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Has Students on App</p>
                                <p className="font-medium">
                                    {coach.hasStudentsOnApp ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Languages</p>
                                <p className="font-medium">
                                    {coach.languages.join(", ")}
                                </p>
                            </div>
                        </div>

                        {/* CV Link */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">CV / Resume</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(coach.cvFile, '_blank')}
                                    className="bg-white"
                                >
                                    View CV
                                </Button>
                            </div>
                        </div>

                        {/* Price Section - Set Coach Rate */}
                        {/* Price Section - Set Coach Rate */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">Set Coach Rate (Required for verification)</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {/* Price and Currency Row */}
                                <div className="flex flex-wrap items-end gap-3">
                                    {/* Currency Dropdown */}
                                    <div className="w-32">
                                        <Label htmlFor="currency" className="text-sm font-medium text-green-700">
                                            Currency
                                        </Label>
                                        <Select value={currency} onValueChange={setCurrency}>
                                            <SelectTrigger id="currency" className="mt-1 bg-white border-green-300 w-full">
                                                <SelectValue placeholder="Currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CURRENCIES.map((curr) => {
                                                    const Icon = curr.icon;
                                                    return (
                                                        <SelectItem key={curr.value} value={curr.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4" />
                                                                <span>{curr.label} ({curr.symbol})</span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Input - Fixed width */}
                                    <div className="w-40">
                                        <Label htmlFor="price" className="text-sm font-medium text-green-700">
                                            Hourly Rate <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SelectedCurrencyIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={price}
                                                onChange={(e) => {
                                                    setPrice(e.target.value);
                                                    setPriceError("");
                                                }}
                                                className="pl-8 bg-white border-green-300 focus:border-green-500 w-full"
                                            />
                                        </div>
                                        {priceError && (
                                            <p className="text-sm text-red-600 mt-1">{priceError}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-green-600">
                                    Rate will be displayed as: {CURRENCIES.find(c => c.value === currency)?.symbol}{price || "0.00"}/hour
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Three Buttons at the Bottom with Gap */}
                    <DialogFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t pt-6 mt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="sm:px-6 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleRejectClick}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 sm:px-6 w-full sm:w-auto"
                        >
                            <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            Reject Application
                        </Button>

                        <Button
                            variant="default"
                            onClick={handleVerify}
                            disabled={isSubmitting || !price || parseFloat(price) <= 0}
                            className="bg-green-600 hover:bg-green-700 sm:px-6 w-full sm:w-auto"
                        >
                            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                                {isSubmitting ? "Verifying..." : `Verify & Set Rate`}
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rejection Reason Confirmation Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Reject Application
                        </DialogTitle>
                        <DialogDescription>
                            You are about to reject {coach?.firstName} {coach?.lastName}`&apos;`s application.
                            Please provide a reason for rejection.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="rejectionReason" className="text-sm font-medium">
                                    Rejection Reason <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="rejectionReason"
                                    placeholder="Please provide a reason why this application is being rejected..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="min-h-[120px] mt-1.5"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    This reason will be visible to the coach.
                                </p>
                            </div>

                            {coach && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium">Application Summary</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">
                                            {coach.firstName} {coach.lastName}
                                        </span>
                                        {coach.fideId && (
                                            <span className="text-xs text-gray-500">
                                                FIDE: {coach.fideId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                setRejectionReason("")
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmReject}
                            disabled={isSubmitting || !rejectionReason.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Rejecting...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Confirm Rejection
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CoachReviewPendingDialog;