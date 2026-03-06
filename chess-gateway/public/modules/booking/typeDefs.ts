import gql from "graphql-tag";

const bookingTypeDefs = gql`
  scalar DateTime

  enum BookingStatus {
    pending
    confirmed
    completed
    cancelled
    refunded
  }

  enum BookingFilterType {
    TEXT
    SELECT
    DATE
    RANGE
  }

  enum SortType {
    ASC
    DESC
  }

  type Booking {
    _id: ID!
    coachId: ID!
    coachName: String!
    coachEmail: String!
    coachWhatsapp: String
    customerEmail: String!
    customerPhone: String
    customerName: String
    duration: Int!
    amount: Float!
    currency: String!
    orderId: String!
    userId: ID!
    payerId: String
    status: BookingStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BookingNode {
    _id: ID!
    coachId: ID!
    coachName: String!
    coachEmail: String!
    coachWhatsapp: String
    customerEmail: String!
    customerPhone: String
    customerName: String
    duration: Int!
    userId: ID
    amount: Float!
    currency: String!
    orderId: String!
    payerId: String
    status: BookingStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BookingEdge {
    node: BookingNode!
    cursor: String!
  }

  type BookingConnection {
    edges: [BookingEdge!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    total: Int!
    hasNextPage: Boolean!
    endCursor: String
  }

  type BookingResponse {
    ok: Boolean!
    message: String!
    bookingId: ID
    booking: Booking
  }

  input CreateBookingInput {
    coachId: ID!
    customerEmail: String!
    customerPhone: String
    customerName: String
    duration: Int!
    amount: Float!
    currency: String
    orderId: String!
    payerId: String
  }

  input UpdateBookingStatusInput {
    _id: ID!
    status: BookingStatus!
  }

  input BookingFilter {
    key: String!
    term: String!
    type: BookingFilterType!
  }

  input BookingSort {
    key: String!
    order: SortType!
  }

  input DateRangeInput {
    from: DateTime!
    to: DateTime!
  }

  type Query {
    fetchBooking(_id: ID!): Booking
    fetchBookings: [Booking!]!
    fetchCustomerBookings(email: String!): [Booking!]!
    fetchCoachBookings(coachId: ID!): [Booking!]!
    fetchBookingTable(
      first: Int = 10
      after: ID
      search: String
      filter: [BookingFilter!]
      sort: BookingSort
    ): BookingConnection!
    fetchBookingStats(
      startDate: DateTime
      endDate: DateTime
    ): BookingStats!
  }

  type BookingStats {
    totalBookings: Int!
    totalRevenue: Float!
    completedBookings: Int!
    cancelledBookings: Int!
    averageBookingValue: Float!
    bookingsByCoach: [CoachBookingStats!]!
    recentBookings: [Booking!]!
  }

  type CoachBookingStats {
    coachId: ID!
    coachName: String!
    totalBookings: Int!
    totalRevenue: Float!
    totalHours: Int!
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): BookingResponse!
    updateBookingStatus(input: UpdateBookingStatusInput!): BookingResponse!
    cancelBooking(_id: ID!, reason: String): BookingResponse!
    deleteBooking(_id: ID!): BookingResponse!
    deleteMultipleBookings(ids: [ID!]!): BookingResponse!
  }
`;

export default bookingTypeDefs;