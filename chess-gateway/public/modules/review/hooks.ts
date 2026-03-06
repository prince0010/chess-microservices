import { useQuery, useMutation } from "@apollo/client/react";
import {
    FETCH_REVIEW,
    FETCH_COACH_REVIEWS,
    FETCH_USER_REVIEWS,
    FETCH_BOOKING_REVIEW,
} from "./queries";
import {
    CREATE_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
} from "./mutation";

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

export const useFetchReview = (_id?: string) =>
    useQuery<any>(FETCH_REVIEW, {
        variables: { _id },
        skip: !_id,
        fetchPolicy: "network-only",
    });

export const useFetchCoachReviews = (coachId?: string) =>
    useQuery<any>(FETCH_COACH_REVIEWS, {
        variables: { coachId },
        skip: !coachId,
        fetchPolicy: "network-only",
    });

export const useFetchUserReviews = (userId?: string) =>
    useQuery<any>(FETCH_USER_REVIEWS, {
        variables: { userId },
        skip: !userId,
        fetchPolicy: "network-only",
    });

export const useFetchBookingReview = (bookingId?: string) =>
    useQuery<any>(FETCH_BOOKING_REVIEW, {
        variables: { bookingId },
        skip: !bookingId,
        fetchPolicy: "network-only",
    });

export const useCreateReview = () => {
    const [mutate, { data, loading, error }] = useMutation<CreateReviewResponse, { input: CreateReviewInput }>(CREATE_REVIEW, {
        fetchPolicy: 'network-only',
    });

    const createReview = async (input: CreateReviewInput) => {
        try {
            const response = await mutate({
                variables: { input },
            });
            return response.data?.createReview;
        } catch (err) {
            console.error('Create review error:', err);
            throw err;
        }
    };

    return { createReview, loading, error, data };
};

export const useUpdateReview = () => useMutation<any>(UPDATE_REVIEW);
export const useDeleteReview = () => useMutation<any>(DELETE_REVIEW);