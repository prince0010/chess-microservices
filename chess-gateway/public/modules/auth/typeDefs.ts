import gql from "graphql-tag"

const authTypeDefs = gql`
  type LoginResponse {
    ok: Boolean!
    message: String!
    user: User!
  }

  type Mutation {
    loginUser(identifier: String!, password: String!): LoginResponse
    changePassword(_id: ID!, newPassword: String!): Response
  }
`

export default authTypeDefs