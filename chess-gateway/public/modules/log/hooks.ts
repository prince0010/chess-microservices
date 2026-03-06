import { FETCH_LOG_TABLE } from "./queries"
import { useQuery } from "@apollo/client/react"

export const useFetchLogTable = ({
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
  useQuery<any>(FETCH_LOG_TABLE, {
    variables: {
      first,
      after,
      search,
      filter,
      sort,
    },
    fetchPolicy: "network-only",
    pollInterval: 15000, // Refetch data every 5 seconds
  })
