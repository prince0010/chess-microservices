import { gql } from "@apollo/client";

export const CREATE_COACH = gql`
  mutation CreateCoach($input: CreateCoachInput!, $photo: String, $cvFile: String!) {
    createCoach(input: $input, photo: $photo, cvFile: $cvFile) {
      ok
      message
    }
  }
`;

export const UPDATE_COACH = gql`
  mutation UpdateCoach($input: UpdateCoachInput!) {
    updateCoach(input: $input) {
      ok
      message
    }
  }
`;

// UPDATED: Add price and currency parameters
export const REVIEW_COACH = gql`
  mutation ReviewCoach(
    $_id: ID!, 
    $status: CoachStatus!, 
    $rejectionReason: String,
    $price: Float,
    $currency: String
  ) {
    reviewCoach(
      _id: $_id, 
      status: $status, 
      rejectionReason: $rejectionReason,
      price: $price,
      currency: $currency
    ) {
      ok
      message
    }
  }
`;

export const CHANGE_COACH_STATUS = gql`
  mutation ChangeCoachStatus($_id: ID!, $status: CoachStatus!) {
    changeCoachStatus(_id: $_id, status: $status) {
      ok
      message
    }
  }
`;

export const DELETE_COACH = gql`
  mutation DeleteCoach($_id: ID!) {
    deleteCoach(_id: $_id) {
      ok
      message
    }
  }
`;

export const DELETE_MULTIPLE_COACHES = gql`
  mutation DeleteMultipleCoaches($ids: [ID!]!) {
    deleteMultipleCoaches(ids: $ids) {
      ok
      message
    }
  }
`;