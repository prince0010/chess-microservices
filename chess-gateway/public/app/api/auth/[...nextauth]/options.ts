import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { LOGIN } from "@/modules/auth/mutations"
import CryptoJS from "crypto-js"

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS }),
  // link: new HttpLink({ uri: process.env.NEXTAUTH_URL + "/api/graphql" }),
  cache: new InMemoryCache(),
})

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        enc: { label: "Encrypted Data", type: "text" },
      },
      authorize: async (credentials: any): Promise<any> => {
        try {
          if (!process.env.NEXT_PUBLIC_NEXTAUTH_SECRET) {
            throw new Error("Network error. Please try again later.")
          }
          const bytes = CryptoJS.AES.decrypt(
            credentials.enc,
            process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
          )
          const { username, password } = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          )
          const { data }: any = await client.mutate({
            mutation: LOGIN,
            variables: {
              identifier: username,
              password,
            },
          })
          if (!data?.loginUser) throw new Error("Invalid credentials")
          return { user: data?.loginUser?.user }
        } catch (error: any) {
          console.error(error)
          throw new Error(
            "Failed to login. Please check credentials and try again."
          )
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      if (user) token.user = user.user
      if (trigger === "update" && session) token.user = session.user
      return token
    },
    session: async ({ session, token }: any) => {
      session.user = token.user
      return session
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(options)
