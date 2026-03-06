import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { ApolloServer } from "@apollo/server"
import { NextRequest } from "next/server"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { getToken } from "next-auth/jwt"
import dotenv from "dotenv"
import { connectDB } from "@/lib/db"
import { resolvers, typeDefs } from "@/modules"

dotenv.config()

export const schema = makeExecutableSchema({ resolvers, typeDefs })
const server = new ApolloServer({
  schema,
  csrfPrevention: false,
  cache: 'bounded',
})
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    await connectDB()
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    return {
      req,
      session,
    }
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
