import { gql } from "@apollo/client"

export const FETCH_LOG_TABLE = gql`
  query FetchLogTable(
    $first: Int
    $after: ID
    $search: String
    $filter: [Filter]
    $sort: Sort
  ) {
    fetchLogTable(
      first: $first
      after: $after
      search: $search
      filter: $filter
      sort: $sort
    ) {
      edges {
        cursor
        node {
          _id
          user {
            firstName
            lastName
          }
          action
          createdAt
          updatedAt
        }
      }
      pageInfo {
        total
        hasNextPage
        endCursor
      }
    }
  }
`
