// modules/coach/hooks.ts
import { useQuery, useMutation } from "@apollo/client/react";
import {
    FETCH_COACH,
    FETCH_COACH_BY_EMAIL,
    FETCH_ALL_COACHES,
    FETCH_COACH_OPTIONS,
    FETCH_COACH_TABLE,
} from "./queries";
import {
    CREATE_COACH,
    UPDATE_COACH,
    REVIEW_COACH,
    CHANGE_COACH_STATUS,
    DELETE_COACH,
    DELETE_MULTIPLE_COACHES,
} from "./mutation";

export const useFetchCoach = (_id?: string) =>
    useQuery<any>(FETCH_COACH, {
        variables: { _id },
        skip: !_id,
        fetchPolicy: "network-only",
    });

// ADD THIS NEW HOOK
export const useFetchCoachByEmail = (email?: string) =>
    useQuery<any>(FETCH_COACH_BY_EMAIL, {
        variables: { email },
        skip: !email,
        fetchPolicy: "network-only",
    });

export const useFetchAllCoaches = () =>
    useQuery<any>(FETCH_ALL_COACHES, {
        fetchPolicy: "network-only",
    });

export const useFetchCoachOptions = () =>
    useQuery<any>(FETCH_COACH_OPTIONS, {
        fetchPolicy: "network-only",
    });

export const useFetchCoachTable = ({
    first,
    after,
    search,
    filter,
    sort,
}: {
    first: number;
    after?: string;
    search?: string;
    filter?: any[];
    sort?: any;
}) => {
    // Clean the filter array - ensure each filter has key, term, and type
    const cleanedFilter = filter
        ?.filter(f => f && f.key && f.term && f.type)
        .map(f => ({
            key: f.key,
            term: f.term,
            type: f.type
        }));

    console.log("🔍 useFetchCoachTable - original filter:", filter);
    console.log("🔍 useFetchCoachTable - cleaned filter:", cleanedFilter);

    return useQuery<any>(FETCH_COACH_TABLE, {
        variables: {
            first,
            after,
            search,
            filter: cleanedFilter?.length ? cleanedFilter : undefined,
            sort,
        },
        fetchPolicy: "cache-and-network",
    });
};

export const useCreateCoach = () => useMutation<any>(CREATE_COACH);
export const useUpdateCoach = () => useMutation<any>(UPDATE_COACH);
export const useReviewCoach = () => useMutation<any>(REVIEW_COACH);
export const useChangeCoachStatus = () => useMutation<any>(CHANGE_COACH_STATUS);
export const useDeleteCoach = () => useMutation<any>(DELETE_COACH);
export const useDeleteMultipleCoaches = () => useMutation<any>(DELETE_MULTIPLE_COACHES);