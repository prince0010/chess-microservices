// modules/auth/mutations/index.ts
import { gql } from "@apollo/client"

export const LOGIN = gql`
  mutation LoginUser($identifier: String!, $password: String!) {
    loginUser(identifier: $identifier, password: $password) {
      ok
      message
      user {
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
  }
`

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($_id: ID!, $newPassword: String!) {
    changePassword(_id: $_id, newPassword: $newPassword) {
      ok
      message
    }
  }
`