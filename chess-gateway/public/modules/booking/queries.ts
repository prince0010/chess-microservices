import { gql } from "@apollo/client";

export const FETCH_BOOKING = gql`
  query FetchBooking($_id: ID!) {
    fetchBooking(_id: $_id) {
      _id
      coachId
      coachName
      coachEmail
      coachWhatsapp
      customerEmail
      customerPhone
      customerName
      duration
      amount
      currency
      orderId
      payerId
      status
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_ALL_BOOKINGS = gql`
  query FetchAllBookings {
    fetchBookings {
      _id
      coachId
      coachName
      coachEmail
      customerEmail
      customerName
      duration
      amount
      currency
      orderId
      status
      createdAt
    }
  }
`;

export const FETCH_CUSTOMER_BOOKINGS = gql`
  query FetchCustomerBookings($email: String!) {
    fetchCustomerBookings(email: $email) {
      _id
      coachId
      coachName
      coachEmail
      coachWhatsapp
      duration
      amount
      currency
      orderId
      status
      createdAt
    }
  }
`;

export const FETCH_COACH_BOOKINGS = gql`
  query FetchCoachBookings($coachId: ID!) {
    fetchCoachBookings(coachId: $coachId) {
      _id
      coachId
      coachName
      customerEmail
      customerName
      customerPhone
      duration
      amount
      currency
      orderId
      userId
      status
      createdAt
    }
  }
`;

export const FETCH_BOOKING_TABLE = gql`
  query FetchBookingTable(
    $first: Int
    $after: ID
    $search: String
    $filter: [BookingFilter!]
    $sort: BookingSort
  ) {
    fetchBookingTable(
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
          coachId
          coachName
          coachEmail
          customerEmail
          customerName
          customerPhone
          duration
          amount
          currency
          orderId
          status
          createdAt
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

export const FETCH_BOOKING_STATS = gql`
  query FetchBookingStats($startDate: DateTime, $endDate: DateTime) {
    fetchBookingStats(startDate: $startDate, endDate: $endDate) {
      totalBookings
      totalRevenue
      completedBookings
      cancelledBookings
      averageBookingValue
      bookingsByCoach {
        coachId
        coachName
        totalBookings
        totalRevenue
        totalHours
      }
      recentBookings {
        _id
        coachName
        customerEmail
        amount
        currency
        status
        createdAt
      }
    }
  }
`;