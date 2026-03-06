import gql from "graphql-tag";

const reviewTypeDefs = gql`
  type Review {
    _id: ID!
    bookingId: ID!
    coachId: ID!
    userId: ID!
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    coach: Coach!
    booking: Booking!
  }

  input CreateReviewInput {
    bookingId: ID!
    coachId: ID!
    userId: ID!
    rating: Int!
    comment: String!
  }

  type ReviewResponse {
    ok: Boolean!
    message: String!
    reviewId: ID
  }

  type Query {
    fetchReview(_id: ID!): Review
    fetchCoachReviews(coachId: ID!): [Review!]!
    fetchUserReviews(userId: ID!): [Review!]!
    fetchBookingReview(bookingId: ID!): Review
  }

  type Mutation {
    createReview(input: CreateReviewInput!): ReviewResponse!
    updateReview(_id: ID!, rating: Int, comment: String): ReviewResponse!
    deleteReview(_id: ID!): ReviewResponse!
  }
`;

export default reviewTypeDefs