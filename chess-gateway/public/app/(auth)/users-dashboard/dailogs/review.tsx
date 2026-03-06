// app/user-dashboard/dailogs/review.tsx
"use client"

import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    booking: {
        _id: string;
        coachId: string;
        coachName: string;
        coachEmail?: string;
    };
    onSubmitReview: (rating: number, comment: string) => Promise<void>;
    existingReview?: {
        rating: number;
        comment: string;
    } | null;
}

export default function ReviewDialog({
    isOpen,
    onClose,
    booking,
    onSubmitReview,
    existingReview
}: ReviewDialogProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skipReview, setSkipReview] = useState(false);

    // Reset form when dialog opens with new booking
    useEffect(() => {
        if (isOpen) {
            setRating(existingReview?.rating || 0);
            setComment(existingReview?.comment || '');
            setSkipReview(false);
        }
    }, [isOpen, existingReview]);

    const handleSubmit = async () => {
        if (skipReview) {
            // If user wants to skip, just close the dialog
            onClose();
            return;
        }

        setIsSubmitting(true);
        try {
            // Even if rating is 0, we'll still submit (backend can handle optional)
            await onSubmitReview(rating || 0, comment);
            toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to submit review' + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        {existingReview ? 'Update Your Review' : 'Review Your Coach'}
                    </DialogTitle>
                    <DialogDescription>
                        {existingReview
                            ? `Your review for ${booking.coachName}`
                            : `Share your experience with ${booking.coachName} (optional)`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Coach Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10 bg-orange-100">
                            <AvatarFallback className="text-orange-700">
                                {getInitials(booking.coachName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium text-gray-900">{booking.coachName}</h4>
                            {booking.coachEmail && (
                                <p className="text-xs text-gray-500">{booking.coachEmail}</p>
                            )}
                        </div>
                    </div>

                    {/* Star Rating - Optional */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Rating <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <div className="flex gap-1 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${(hoverRating || rating) >= star
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <div className="text-center text-sm text-gray-500">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </div>
                        )}
                    </div>

                    {/* Review Comment - Optional */}
                    <div className="space-y-2">
                        <label htmlFor="review" className="text-sm font-medium text-gray-700">
                            Your Review <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <Textarea
                            id="review"
                            placeholder="Share your experience with this coach... (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-gray-500">
                            Your review helps other students choose the right coach.
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        {!existingReview && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setSkipReview(true);
                                    handleSubmit();
                                }}
                                disabled={isSubmitting}
                            >
                                Skip
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={() => {
                                setSkipReview(false);
                                handleSubmit();
                            }}
                            disabled={isSubmitting}
                            className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    {existingReview ? 'Update' : 'Submit'}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}