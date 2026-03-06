import { mergeTypeDefs } from "@graphql-tools/merge"
import { mergeResolvers } from "@graphql-tools/merge"

// Type Defs
import sharedTypeDefs from "./shared/typeDefs"


// Resolvers

import authTypeDefs from "./auth/typeDefs"
import authResolvers from "./auth/resolvers"
import logResolvers from "./log/resolvers"
import logTypeDefs from "./log/typeDefs"
import coachTypeDefs from "./coach/typeDefs"
import coachResolvers from "./coach/resolvers"
import bookingTypeDefs from "./booking/typeDefs"
import bookingResolvers from "./booking/resolvers"
import userResolvers from "./user/resolvers"
import userTypeDefs from "./user/typeDefs"
import reviewTypeDefs from "./review/typeDefs"
import reviewResolvers from "./review/resolvers"

export const typeDefs = mergeTypeDefs([
  authTypeDefs,
  sharedTypeDefs,
  userTypeDefs,
  logTypeDefs,
  coachTypeDefs,
  bookingTypeDefs,
  reviewTypeDefs,
])

export const resolvers = mergeResolvers([
  authResolvers,
  userResolvers,
  logResolvers,
  coachResolvers,
  bookingResolvers,
  reviewResolvers
])
