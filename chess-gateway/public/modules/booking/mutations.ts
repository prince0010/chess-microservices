import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      ok
      message
      bookingId
      booking {
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
      }
    }
  }
`

export const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($input: UpdateBookingStatusInput!) {
    updateBookingStatus(input: $input) {
      ok
      message
      bookingId
      booking {
        _id
        status
        updatedAt
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($_id: ID!, $reason: String) {
    cancelBooking(_id: $_id, reason: $reason) {
      ok
      message
      bookingId
      booking {
        _id
        status
        updatedAt
      }
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($_id: ID!) {
    deleteBooking(_id: $_id) {
      ok
      message
      bookingId
    }
  }
`;

export const DELETE_MULTIPLE_BOOKINGS = gql`
  mutation DeleteMultipleBookings($ids: [ID!]!) {
    deleteMultipleBookings(ids: $ids) {
      ok
      message
    }
  }
`;