import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
    FETCH_BOOKING,
    FETCH_ALL_BOOKINGS,
    FETCH_CUSTOMER_BOOKINGS,
    FETCH_COACH_BOOKINGS,
    FETCH_BOOKING_TABLE,
    FETCH_BOOKING_STATS
} from "./queries";
import {
    CREATE_BOOKING,
    UPDATE_BOOKING_STATUS,
    CANCEL_BOOKING,
    DELETE_BOOKING,
    DELETE_MULTIPLE_BOOKINGS
} from "./mutations";

// ============= QUERIES =============
export const useFetchBooking = (_id?: string) =>
    useQuery<any>(FETCH_BOOKING, {
        variables: { _id },
        skip: !_id,
        fetchPolicy: "network-only"
    });

export const useFetchAllBookings = () =>
    useQuery<any>(FETCH_ALL_BOOKINGS, {
        fetchPolicy: "network-only",
        skip: typeof window === 'undefined'
    });

export const useFetchCustomerBookings = (email?: string) =>
    useQuery<any>(FETCH_CUSTOMER_BOOKINGS, {
        variables: { email },
        skip: !email,
        fetchPolicy: "network-only"
    });

export const useFetchCoachBookings = (coachId?: string) =>
    useQuery<any>(FETCH_COACH_BOOKINGS, {
        variables: { coachId },
        skip: !coachId,
        fetchPolicy: "network-only"
    });

export const useFetchBookingTable = ({
    first,
    after,
    search,
    filter,
    sort
}: {
    first: number;
    after?: string;
    search?: string;
    filter?: any[];
    sort?: any;
}) =>
    useQuery<any>(FETCH_BOOKING_TABLE, {
        variables: {
            first,
            after,
            search,
            filter,
            sort
        },
        fetchPolicy: "cache-and-network",
        skip: typeof window === 'undefined'
    });

export const useFetchBookingStats = (startDate?: Date, endDate?: Date) =>
    useQuery<any>(FETCH_BOOKING_STATS, {
        variables: { startDate, endDate },
        fetchPolicy: "network-only",
        skip: typeof window === 'undefined'
    });

// ============= MUTATIONS =============
export const useCreateBooking = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(CREATE_BOOKING);

    const createBooking = async (input: any) => {
        try {
            const response = await mutate({
                variables: { input },
                update: (cache, { data }) => {
                    if (data?.createBooking?.ok) {
                        cache.modify({
                            fields: {
                                fetchBookingTable(existing = { edges: [] }) {
                                    return existing;
                                }
                            }
                        });
                    }
                }
            });
            return response.data?.createBooking;
        } catch (err) {
            console.error('Create booking error:', err);
            throw err;
        }
    };

    return { createBooking, loading, error, data };
};

export const useUpdateBookingStatus = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(UPDATE_BOOKING_STATUS);

    const updateBookingStatus = async (_id: string, status: string) => {
        try {
            const response = await mutate({
                variables: { input: { _id, status } }
            });
            return response.data?.updateBookingStatus;
        } catch (err) {
            console.error('Update booking status error:', err);
            throw err;
        }
    };

    return { updateBookingStatus, loading, error, data };
};

export const useCancelBooking = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(CANCEL_BOOKING);

    const cancelBooking = async (_id: string, reason?: string) => {
        try {
            const response = await mutate({
                variables: { _id, reason }
            });
            return response.data?.cancelBooking;
        } catch (err) {
            console.error('Cancel booking error:', err);
            throw err;
        }
    };

    return { cancelBooking, loading, error, data };
};

export const useDeleteBooking = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(DELETE_BOOKING);

    const deleteBooking = async (_id: string) => {
        try {
            const response = await mutate({
                variables: { _id },
                update: (cache) => {
                    cache.evict({ id: `Booking:${_id}` });
                    cache.gc();
                }
            });
            return response.data?.deleteBooking;
        } catch (err) {
            console.error('Delete booking error:', err);
            throw err;
        }
    };

    return { deleteBooking, loading, error, data };
};

export const useDeleteMultipleBookings = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(DELETE_MULTIPLE_BOOKINGS);

    const deleteMultipleBookings = async (ids: string[]) => {
        try {
            const response = await mutate({
                variables: { ids },
                update: (cache) => {
                    ids.forEach(id => {
                        cache.evict({ id: `Booking:${id}` });
                    });
                    cache.gc();
                }
            });
            return response.data?.deleteMultipleBookings;
        } catch (err) {
            console.error('Delete multiple bookings error:', err);
            throw err;
        }
    };

    return { deleteMultipleBookings, loading, error, data };
};