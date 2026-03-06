// modules/coach/queries.ts
import { gql } from "@apollo/client";

export const FETCH_COACH = gql`
  query FetchCoach($_id: ID!) {
    fetchCoach(_id: $_id) {
      _id
      firstName
      lastName
      phoneNumber
      email
      fideId
      photo
      hasStudentsOnApp
      wantsToBeListed
      cvFile
      achievements
      languages
      chessTitle
      status
      isActive
      applicationDate
      reviewedBy
      reviewedAt
      rejectionReason
      price
      currency
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_COACH_BY_EMAIL = gql`
  query FetchCoachByEmail($email: String!) {
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

export const FETCH_ALL_COACHES = gql`
  query FetchAllCoaches {
    fetchCoaches {
      _id
      firstName
      lastName
      email
      phoneNumber
      chessTitle
      status
      achievements
      applicationDate
      reviewedBy
      reviewedAt
      rejectionReason
      price
      currency
    }
  }
`;

export const FETCH_COACH_OPTIONS = gql`
  query FetchCoachOptions {
    fetchCoachOptions {
      label
      value
    }
  }
`;

export const FETCH_COACH_TABLE = gql`
  query FetchCoachTable(
    $first: Int
    $after: ID
    $search: String
    $filter: [CoachFilter!]
    $sort: CoachSort
  ) {
    fetchCoachTable(
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
          phoneNumber
          email
          fideId
          photo
          hasStudentsOnApp
          wantsToBeListed
          languages
          chessTitle
          status
          cvFile
          achievements
          isActive
          applicationDate
          reviewedBy
          reviewedAt
          rejectionReason
          price
          currency
        }
      }
      pageInfo {
        total
        hasNextPage
        endCursor
      }
    }
  }
`;