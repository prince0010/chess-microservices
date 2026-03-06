// components/custom/coach-reviews-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, MessageSquare, User, Mail, Phone } from "lucide-react";
import { useFetchUserReviews } from "@/modules/review/hooks";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Update the interface to accept student information
interface CoachReviewsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    student: {
        _id?: string;
        name: string;
        email: string;
        phone?: string;
    } | null;
    coachName?: string;
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    coach?: {
        _id: string;
        firstName: string;
        lastName: string;
    };
}

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                />
            ))}
            <span className="ml-1 text-sm font-medium text-gray-700">{rating}.0</span>
        </div>
    );
};

const ReviewSkeleton = () => (
    <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
    </div>
);

export default function CoachReviewsDialog({
    isOpen,
    onClose,
    student,
    coachName
}: CoachReviewsDialogProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);

    // Fetch reviews by user ID if available
    const userId = student?._id;
    const { data, loading, refetch } = useFetchUserReviews(userId);

    useEffect(() => {
        if (data?.fetchUserReviews) {
            const fetchedReviews = data.fetchUserReviews;
            setReviews(fetchedReviews);

            // Calculate average rating
            if (fetchedReviews.length > 0) {
                const total = fetchedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
                setAverageRating(total / fetchedReviews.length);
            } else {
                setAverageRating(0);
            }
        }
    }, [data]);

    // Refresh when dialog opens
    useEffect(() => {
        if (isOpen && userId) {
            refetch();
        }
    }, [isOpen, userId, refetch]);

    if (!student) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <MessageSquare className="w-6 h-6" />
                        Student Reviews
                    </DialogTitle>
                    <DialogDescription>
                        Reviews written by {student.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-4 mb-6 border border-orange-100">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-orange-100 text-orange-800 text-lg">
                                    {student.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-[18px] underline underline-offset-4 font-semibold text-gray-900">{student.name}</h3>
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4 text-orange-500" />
                                        <span>{student.email}</span>
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 text-orange-500" />
                                            <span>{student.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {reviews.length > 0 && (
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-orange-600">
                                        {averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <StarRating rating={Math.round(averageRating)} />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[350px] pr-4">
                        {loading ? (
                            <div className="space-y-4">
                                <ReviewSkeleton />
                                <ReviewSkeleton />
                                <ReviewSkeleton />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    No Reviews Yet
                                </h3>
                                <p className="text-sm text-gray-500">
                                    This student hasn`&apos;`t written any reviews yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                {review.coach && (
                                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                                        Review for Coach: {review.coach.firstName} {review.coach.lastName}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <Separator />
                                        <span className="font-semibold text-muted-foreground text-xs">Comment:</span>
                                        <p className="text-gray-700 text-sm">
                                            `&quot;` {review.comment} `&quot;`
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}