// app/coach/dashboard/page.tsx
"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchCoachBookings } from "@/modules/booking/hooks";
import { BookingStatus } from "@/modules/booking/interface";
import { gql } from "@apollo/client";
import { format } from 'date-fns';
import {
    Calendar,
    User,
    Phone,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    MoreHorizontal,
    MessageSquare,
    Eye,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import CoachReviewsDialog from "./dialogs/review";

// Define types
interface SimpleCoach {
    _id: string;
    firstName: string;
    lastName: string;
    photo?: string;
    email?: string;
    phoneNumber?: string;
    price?: number;
    currency?: string;
}

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface CoachProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    price?: number;
    currency?: string;
}

interface Booking {
    _id: string;
    coachId: string;
    coachName: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    duration: number;
    amount: number;
    currency: string;
    orderId: string;
    status: BookingStatus;
    createdAt: string;
    userId?: string;  // This is already in your booking data!
}

interface GetUserByUsernameResponse {
    fetchUserByUsername: UserProfile;
}

interface GetCoachByEmailResponse {
    fetchCoachByEmail: CoachProfile;
}

// Query to get user by username
const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    fetchUserByUsername(username: $username) {
      _id
      username
      email
      firstName
      lastName
      role
    }
  }
`;

// Query to get coach by email
const GET_COACH_BY_EMAIL = gql`
  query GetCoachByEmail($email: String!) {
    fetchCoachByEmail(email: $email) {
      _id
      firstName
      lastName
      email
      phoneNumber
      price
      currency
    }
  }
`;

export default function CoachDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [coachId, setCoachId] = useState<string | undefined>();
    const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
    const [selectedStudentForReviews, setSelectedStudentForReviews] = useState<{
        _id?: string;
        name: string;
        email: string;
        phone?: string;
    } | null>(null);

    // Get username from session
    const username = session?.user?.username;

    // Step 1: Get user by username to get their email
    const { data: userData, loading: userLoading, error: userError } = useQuery<GetUserByUsernameResponse>(GET_USER_BY_USERNAME, {
        variables: { username },
        skip: !username,
        fetchPolicy: "network-only",
    });

    // Set user profile when data arrives
    useEffect(() => {
        if (userData?.fetchUserByUsername) {
            const user = userData.fetchUserByUsername;
            setUserProfile(user);
        }
    }, [userData]);

    const userEmail = userProfile?.email;

    // Step 2: Get coach by email
    const { data: coachData, loading: coachLoading, error: coachError } = useQuery<GetCoachByEmailResponse>(GET_COACH_BY_EMAIL, {
        variables: { email: userEmail },
        skip: !userEmail,
        fetchPolicy: "network-only",
    });

    // Set coach data when available
    useEffect(() => {
        if (coachData?.fetchCoachByEmail) {
            const coach = coachData.fetchCoachByEmail;
            setCoachId(coach._id);
            setCoachProfile(coach);
        }
    }, [coachData]);

    // Fetch bookings once we have coachId
    const { data, loading, error, refetch } = useFetchCoachBookings(coachId);
    const bookings2 = data?.fetchCoachBookings || [];
    console.log("Booking data sample:", bookings2[0]);

    // Redirect logic
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }

        if (session?.user?.role !== "coach") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    // Loading states
    if (status === "loading" || userLoading || coachLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (userError || coachError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <XCircle className="h-12 w-12 mx-auto mb-3" />
                    <p>Error loading profile</p>
                </div>
            </div>
        );
    }

    if (!userProfile && !userLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No User Profile Found</h3>
                </div>
            </div>
        );
    }

    if (!coachProfile && !coachLoading && userEmail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Coach Profile Found</h3>
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

    const bookings = data?.fetchCoachBookings || [];

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b: any) => b.status === BookingStatus.CONFIRMED).length,
        completed: bookings.filter((b: any) => b.status === BookingStatus.COMPLETED).length,
        cancelled: bookings.filter((b: any) => b.status === BookingStatus.CANCELLED).length,
        totalRevenue: bookings.reduce((sum: number, b: any) => sum + b.amount, 0),
        totalHours: bookings.reduce((sum: number, b: any) => sum + b.duration, 0)
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
                            <h1 className="text-xl font-bold text-gray-900">Coach Dashboard</h1>
                            <p className="text-sm text-gray-600">
                                {coachProfile?.firstName || session?.user?.firstName} {coachProfile?.lastName || ''}
                                {coachProfile?.price && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        • {formatCurrency(coachProfile.price, coachProfile.currency)}/hr
                                    </span>
                                )}
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
                    <span className="text-gray-600">Total: <span className="font-semibold">{stats.total}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600">Confirmed: {stats.confirmed}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-blue-600">Completed: {stats.completed}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">Hours: {stats.totalHours}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">Revenue: {formatCurrency(stats.totalRevenue)}</span>
                </div>
            </div>

            {/* Compact Bookings Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No bookings yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking: Booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-gray-100 rounded-full p-1 mr-2">
                                                        <User className="h-3 w-3 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.customerName || 'Anonymous'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {booking.customerEmail}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {booking.customerPhone ? (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                                        {booking.customerPhone}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.duration}h</div>
                                                <div className="text-xs text-gray-500">{formatCurrency(booking.amount)}</div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 text-xs"
                                                        >
                                                            <MoreHorizontal className="h-3 w-3" />
                                                            Actions
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {/* View Student Details */}
                                                        {/* <DropdownMenuItem
                                                            onClick={() => {
                                                                console.log("View student:", booking.customerName);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Student
                                                        </DropdownMenuItem> */}

                                                        {/* View Student Reviews - USING THE USERID FROM BOOKING */}
                                                        {coachProfile && booking.userId && (
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedStudentForReviews({
                                                                        _id: booking.userId, // THIS IS THE KEY - it's already in your booking!
                                                                        name: booking.customerName || 'Anonymous',
                                                                        email: booking.customerEmail,
                                                                        phone: booking.customerPhone
                                                                    });
                                                                    setReviewsDialogOpen(true);
                                                                }}
                                                                className="text-purple-600 focus:text-purple-600 cursor-pointer"
                                                            >
                                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                                View Student Reviews
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Dialog */}
            <CoachReviewsDialog
                isOpen={reviewsDialogOpen}
                onClose={() => {
                    setReviewsDialogOpen(false);
                    setSelectedStudentForReviews(null);
                }}
                student={selectedStudentForReviews}
                coachName={coachProfile ? `${coachProfile.firstName} ${coachProfile.lastName}` : undefined}
            />
        </div>
    );
}