import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ok
      message
      reviewId
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($_id: ID!, $rating: Int, $comment: String) {
    updateReview(_id: $_id, rating: $rating, comment: $comment) {
      ok
      message
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($_id: ID!) {
    deleteReview(_id: $_id) {
      ok
      message
    }
  }
`;
