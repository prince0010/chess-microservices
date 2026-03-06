import {
  FETCH_USER,
  FETCH_USER_BY_USERNAME,
  FETCH_ALL_USERS,
  FETCH_USER_OPTIONS,
  FETCH_USER_TABLE,
} from "./queries"
import { CHANGE_USER_STATUS, CREATE_USER, DELETE_MULTIPLE_USERS, DELETE_USER, UPDATE_USER } from "./mutations"
import { useQuery, useMutation } from "@apollo/client/react"

export const useFetchUser = (_id?: string) =>
  useQuery<any>(FETCH_USER, {
    variables: { _id },
    skip: !_id,
    fetchPolicy: "network-only",
  })

export const useFetchUserByUsername = (username?: string) =>
  useQuery<any>(FETCH_USER_BY_USERNAME, {
    variables: { username },
    skip: !username,
    fetchPolicy: "network-only",
  })

export const useFetchAllUsers = () =>
  useQuery<any>(FETCH_ALL_USERS, {
    fetchPolicy: "network-only",
  })

export const useFetchUserOptions = () =>
  useQuery<any>(FETCH_USER_OPTIONS, {
    fetchPolicy: "network-only",
  })

export const useFetchUserTable = ({
  first,
  after,
  search,
  filter,
  sort,
}: {
  first: number
  after?: string
  search?: string
  filter?: any[]
  sort?: any
}) =>
  useQuery<any>(FETCH_USER_TABLE, {
    variables: {
      first,
      after,
      search,
      filter,
      sort,
    },
    fetchPolicy: "cache-and-network",
  })


export const useCreateUser = () => useMutation<any>(CREATE_USER)
export const useUpdateUser = () => useMutation<any>(UPDATE_USER)
export const useChangeUserStatus = () => useMutation<any>(CHANGE_USER_STATUS)
export const useDeleteUser = () => useMutation<any>(DELETE_USER)
export const useDeleteMultipleUsers = () => useMutation<any>(DELETE_MULTIPLE_USERS)