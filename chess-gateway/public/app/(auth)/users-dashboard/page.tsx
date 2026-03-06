// app/user-dashboard/page.tsx
"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchCustomerBookings } from "@/modules/booking/hooks";
import { BookingStatus } from "@/modules/booking/interface";
import { format } from 'date-fns';
import {
    Calendar,
    User,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    MoreHorizontal,
    Star,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import ReviewDialog from "./dailogs/review";
import { useFetchBookingReview } from "@/modules/review/hooks";

interface CreateReviewInput {
    bookingId: string;
    coachId: string;
    userId: string;
    rating: number;
    comment: string;
}

interface CreateReviewResponse {
    createReview: {
        ok: boolean;
        message: string;
        reviewId: string;
    };
}

interface Booking {
    _id: string;
    coachId: string;
    coachName: string;
    coachEmail: string;
    coachWhatsapp?: string;
    duration: number;
    amount: number;
    currency: string;
    status: BookingStatus;
    createdAt: string;
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// GraphQL mutation for creating a review
const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ok
      message
      reviewId
    }
  }
`;

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [existingReview, setExistingReview] = useState<Review | null>(null);

    // Get user email from session
    const userEmail = session?.user?.email;
    const userId = session?.user?._id;

    // Fetch user's bookings using email
    const { data, loading, error, refetch } = useFetchCustomerBookings(userEmail);

    // Fetch review for selected booking
    const { data: reviewData, refetch: refetchReview } = useFetchBookingReview(selectedBooking?._id);

    // Update existing review when review data changes
    useEffect(() => {
        if (reviewData?.fetchBookingReview) {
            setExistingReview(reviewData.fetchBookingReview);
        } else {
            setExistingReview(null);
        }
    }, [reviewData]);

    // Debug: Log bookings to see their statuses
    useEffect(() => {
        if (data?.fetchCustomerBookings) {
            console.log('===== BOOKINGS DEBUG =====');
            console.log('All bookings:', data.fetchCustomerBookings);
            data.fetchCustomerBookings.forEach((b: any, index: number) => {
                console.log(`Booking ${index + 1}:`, {
                    id: b._id,
                    coachName: b.coachName,
                    status: b.status,
                });
            });
            console.log('=========================');
        }
    }, [data]);

    // Mutation for creating review with proper typing and network policy
    const [createReview] = useMutation<CreateReviewResponse, { input: CreateReviewInput }>(CREATE_REVIEW, {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
        onCompleted: (data) => {
            if (data?.createReview?.ok) {
                console.log('Review submitted successfully:', data.createReview.reviewId);
            }
        },
        onError: (error) => {
            console.error('Review mutation error:', error);
        }
    });

    // Redirect logic
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }

        if (session?.user?.role && session?.user?.role !== "user") {
            if (session?.user?.role === "coach") {
                router.push("/coach-dashboard");
            } else {
                router.push("/dashboard");
            }
        }
    }, [status, session, router]);

    const handleReviewClick = (booking: Booking) => {
        console.log('Review clicked for booking:', booking);
        setSelectedBooking(booking);
        setIsReviewDialogOpen(true);
        // Fetch existing review when dialog opens
        setTimeout(() => {
            refetchReview();
        }, 100);
    };

    const handleSubmitReview = async (rating: number, comment: string): Promise<void> => {
        if (!selectedBooking || !userId) return;

        try {
            const result = await createReview({
                variables: {
                    input: {
                        bookingId: selectedBooking._id,
                        coachId: selectedBooking.coachId,
                        userId: userId,
                        rating: rating,
                        comment: comment,
                    }
                }
            });

            if (result.data?.createReview?.ok) {
                await refetch();
                await refetchReview();
            } else {
                throw new Error(result.data?.createReview?.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            throw error;
        }
    };

    // Loading states
    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <XCircle className="h-12 w-12 mx-auto mb-3" />
                    <p>Error loading bookings: {error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const bookings = (data?.fetchCustomerBookings as Booking[]) || [];

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length,
        completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length,
        cancelled: bookings.filter((b) => b.status === BookingStatus.CANCELLED).length,
        totalSpent: bookings.reduce((sum, b) => sum + b.amount, 0),
        totalHours: bookings.reduce((sum, b) => sum + b.duration, 0)
    };

    const getStatusBadge = (status: BookingStatus) => {
        const statusConfig = {
            [BookingStatus.PENDING]: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                label: 'Pending',
                icon: Clock
            },
            [BookingStatus.CONFIRMED]: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Upcoming',
                icon: CheckCircle
            },
            [BookingStatus.COMPLETED]: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                label: 'Completed',
                icon: CheckCircle
            },
            [BookingStatus.CANCELLED]: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                label: 'Cancelled',
                icon: XCircle
            },
            [BookingStatus.REFUNDED]: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                label: 'Refunded',
                icon: XCircle
            }
        };

        const config = statusConfig[status] || statusConfig[BookingStatus.PENDING];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </span>
        );
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">My Learning Dashboard</h1>
                            <p className="text-sm text-gray-600">
                                Welcome back, {session?.user?.firstName}!
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mini Stats Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-gray-600">Total Lessons: <span className="font-semibold">{stats.total}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600">Upcoming: {stats.upcoming}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-blue-600">Completed: {stats.completed}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">Hours: {stats.totalHours}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">Total Spent: {formatCurrency(stats.totalSpent)}</span>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No bookings yet</p>
                            <button
                                onClick={() => router.push('/find-coach')}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                                Find a Coach
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking) => {
                                        return (
                                            <tr key={booking._id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="bg-gray-100 rounded-full p-1 mr-2">
                                                            <User className="h-3 w-3 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {booking.coachName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {booking.coachWhatsapp ? (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                                            {booking.coachWhatsapp}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                                            {booking.coachEmail}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {booking.duration} {booking.duration === 1 ? 'lesson' : 'lessons'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{formatCurrency(booking.amount)}</div>
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {getStatusBadge(booking.status)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            {/* Review option shows for ALL bookings regardless of status */}
                                                            <DropdownMenuItem
                                                                onClick={() => handleReviewClick(booking)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                                                                <span>Leave a Review</span>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => window.location.href = `mailto:${booking.coachEmail}`}
                                                                className="cursor-pointer"
                                                            >
                                                                <Mail className="h-4 w-4 mr-2" />
                                                                <span>Email Coach</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Dialog */}
            {selectedBooking && (
                <ReviewDialog
                    isOpen={isReviewDialogOpen}
                    onClose={() => {
                        setIsReviewDialogOpen(false);
                        setSelectedBooking(null);
                        setExistingReview(null);
                    }}
                    booking={selectedBooking}
                    onSubmitReview={handleSubmitReview}
                    existingReview={existingReview}
                />
            )}
        </div>
    );
}