import gql from "graphql-tag";

const userTypeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    role: Role!
    coachId: ID
    status: Boolean
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  }

  type UserNode {
    _id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    role: Role!
    coachId: ID
    status: Boolean
    isActive: Boolean
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    role: Role!
    coachId: ID
    status: Boolean
    isActive: Boolean
  }

  input UpdateUserInput {
    _id: ID!
    firstName: String
    lastName: String
    username: String
    email: String
    role: Role
    coachId: ID
    status: Boolean
    isActive: Boolean
  }

  type UserEdge {
    node: UserNode!
    cursor: String!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }
    
  type Query {
    fetchUser(_id: ID!): User
    fetchUserByUsername(username: String!): User
    fetchUsers: [User]
    fetchUserOptions: [Option]
    fetchUserTable(
      first: Int = 10
      after: ID
      search: String
      filter: [Filter]
      sort: Sort
    ): UserConnection!
  }

  type Mutation {
    createUser(input: CreateUserInput!): Response
    updateUser(input: UpdateUserInput!): Response
    changeUserStatus(_id: ID!, status: Boolean!): Response
    deleteUser(_id: ID!): Response
    deleteMultipleUsers(ids: [ID!]!): Response
  }
`;

export default userTypeDefs;