import { gql } from "@apollo/client";

export const FETCH_REVIEW = gql`
  query FetchReview($_id: ID!) {
    fetchReview(_id: $_id) {
      _id
      bookingId
      coachId
      userId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_COACH_REVIEWS = gql`
  query FetchCoachReviews($coachId: ID!) {
    fetchCoachReviews(coachId: $coachId) {
      _id
      rating
      comment
      createdAt
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const FETCH_USER_REVIEWS = gql`
  query FetchUserReviews($userId: ID!) {
    fetchUserReviews(userId: $userId) {
      _id
      bookingId
      coachId
      rating
      comment
      createdAt
      coach {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const FETCH_BOOKING_REVIEW = gql`
  query FetchBookingReview($bookingId: ID!) {
    fetchBookingReview(bookingId: $bookingId) {
      _id
      rating
      comment
      createdAt
    }
  }
`;