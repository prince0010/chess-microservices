import { gql } from "@apollo/client"

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
      message
    }
  }
`
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ok
      message
    }
  }
`
export const CHANGE_USER_STATUS = gql`
  mutation ChangeUserStatus($_id: ID!, $status: Boolean!) {
    changeUserStatus(_id: $_id, status: $status) {
      ok
      message
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($_id: ID!) {
    deleteUser(_id: $_id) {
      ok
      message
    }
  }
`

export const DELETE_MULTIPLE_USERS = gql`
  mutation DeleteMultipleUsers($ids: [ID!]!) {
    deleteMultipleUsers(ids: $ids) {
      ok
      message
    }
  }
`