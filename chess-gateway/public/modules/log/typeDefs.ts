import gql from "graphql-tag"

const logTypeDefs = gql`
  type Log {
    _id: ID!
    user: User!
    action: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type LogEdge {
    node: Log!
    cursor: String!
  }

  type LogConnection {
    edges: [LogEdge]
    pageInfo: PageInfo
  }

  type Query {
    fetchLogTable(
      first: Int = 10
      after: ID
      search: String
      filter: [Filter]
      sort: Sort
    ): LogConnection
  }
`

export default logTypeDefs
