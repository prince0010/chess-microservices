// modules/coach/typeDefs.ts
import gql from "graphql-tag";

const coachTypeDefs = gql`
  scalar DateTime

  enum ChessTitle {
    NONE
    WORLD_CHAMPION
    GRANDMASTER
    WOMAN_GRANDMASTER
    INTERNATIONAL_MASTER
    WOMAN_INTERNATIONAL_MASTER
    FIDE_MASTER
    WOMAN_FIDE_MASTER
    CANDIDATE_MASTER
    WOMAN_CANDIDATE_MASTER
    ARENA_GRANDMASTER
    WOMAN_ARENA_GRANDMASTER
    ARENA_INTERNATIONAL_MASTER
    WOMAN_ARENA_INTERNATIONAL_MASTER
    ARENA_FIDE_MASTER
    WOMAN_ARENA_FIDE_MASTER
  }

  enum CoachStatus {
    pending
    verified
    rejected
  }

  enum FilterType {
    TEXT
    SELECT
    DATE
  }

  enum SortType {
    ASC
    DESC
  }

 type Coach {
    _id: ID!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    fideId: String
    chessTitle: ChessTitle
    photo: String
    hasStudentsOnApp: Boolean!
    wantsToBeListed: Boolean!
    cvFile: String!
    languages: [String!]!
    status: CoachStatus!
    isActive: Boolean!
    applicationDate: DateTime!
    reviewedBy: ID
    reviewedAt: DateTime
    rejectionReason: String
    price: Float
    currency: String
    achievements: [String!]
    createdAt: DateTime
    updatedAt: DateTime
}

type CoachNode {
    _id: ID!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    fideId: String
    chessTitle: ChessTitle
    photo: String
    hasStudentsOnApp: Boolean!
    cvFile: String!
    wantsToBeListed: Boolean!
    languages: [String!]!
    status: CoachStatus!
    isActive: Boolean!
    applicationDate: DateTime!
    reviewedBy: ID
    reviewedAt: DateTime
    rejectionReason: String
    price: Float
    currency: String
    achievements: [String!]
}

  type CoachEdge {
    node: CoachNode!
    cursor: String!
  }

  type CoachConnection {
    edges: [CoachEdge!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    total: Int!
    hasNextPage: Boolean!
    endCursor: String
  }

  type Option {
    label: String!
    value: String!
  }

  type Response {
    ok: Boolean!
    message: String!
  }

  input CreateCoachInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    fideId: String
    chessTitle: ChessTitle
    hasStudentsOnApp: String!
    wantsToBeListed: String!
    languages: [String!]!
  }

input UpdateCoachInput {
    _id: ID!
    firstName: String
    lastName: String
    phoneNumber: String
    email: String
    fideId: String
    chessTitle: ChessTitle
    hasStudentsOnApp: Boolean
    wantsToBeListed: Boolean
    languages: [String!]
    isActive: Boolean
    photo: String
    cvFile: String
    price: Float
    currency: String
    achievements: [String!]
}

  input CoachFilter {
    key: String!
    term: String!
    type: FilterType!
  }

  input CoachSort {
    key: String!
    order: SortType!
  }

  input ReviewCoachInput {
    _id: ID!
    status: CoachStatus!
    rejectionReason: String
    price: Float
    currency: String
  }

  type Query {
    fetchCoach(_id: ID!): Coach
    fetchCoachByEmail(email: String!): Coach
    fetchCoaches: [Coach!]!
    fetchCoachOptions: [Option!]!
    fetchCoachTable(
      first: Int = 10
      after: ID
      search: String
      filter: [CoachFilter!]
      sort: CoachSort
    ): CoachConnection!
  }

  type Mutation {
    createCoach(input: CreateCoachInput!, photo: String, cvFile: String!): Response!
    updateCoach(input: UpdateCoachInput!): Response!
    reviewCoach(
      _id: ID!, 
      status: CoachStatus!, 
      rejectionReason: String, 
      price: Float,
      currency: String
    ): Response!
    changeCoachStatus(_id: ID!, status: CoachStatus!): Response!
    deleteCoach(_id: ID!): Response!
    deleteMultipleCoaches(ids: [ID!]!): Response!
  }
`;

export default coachTypeDefs;