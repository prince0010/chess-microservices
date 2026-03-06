// modules/user/queries.ts
import { gql } from "@apollo/client"

export const FETCH_USER = gql`
  query FetchUser($_id: ID!) {
    fetchUser(_id: $_id) {
      _id
      username
      firstName
      lastName
      email
      role
      status
      isActive
      createdAt
      updatedAt
    }
  }
`

export const FETCH_USER_BY_USERNAME = gql`
  query FetchUserByUsername($username: String!) {
    fetchUserByUsername(username: $username) {
      _id
      username
      email
      firstName
      lastName
      role
    }
  }
`

export const FETCH_ALL_USERS = gql`
  query FetchAllUsers {
    fetchUsers {
      _id
      firstName
      lastName
      username
      email
      role
    }
  }
`

export const FETCH_USER_OPTIONS = gql`
  query FetchUserOptions {
    fetchUserOptions {
      label
      value
    }
  }
`

export const FETCH_USER_TABLE = gql`
  query FetchUserTable(
    $first: Int
    $after: ID
    $search: String
    $filter: [Filter!]
    $sort: Sort
  ) {
    fetchUserTable(
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
          firstName
          lastName
          username
          email
          role
          coachId
          status
          isActive
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