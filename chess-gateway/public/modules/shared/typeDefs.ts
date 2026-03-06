import gql from "graphql-tag"

const sharedTypeDefs = gql`
  scalar DateTime

  enum RequestStatus {
    pending
    endorsed
    approved
    departed
    completed
    rejected
    expired
  }

  enum Role {
    admin
    coach
    user
  }

  enum PassType {
    itinerary
    vehicle
    sick_leave
    emergency
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

  input Filter {
    key: String
    type: FilterType
    term: String
  }

  input Sort {
    key: String
    order: SortType
  }

  type Response {
    ok: Boolean!
    message: String!
  }

  type Option {
    label: String!
    value: String!
  }

  type PageInfo {
    total: Int!
    hasNextPage: Boolean!
    endCursor: String
  }
`

export default sharedTypeDefs
