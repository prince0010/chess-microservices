"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"
import { SSEProvider } from "./sse"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ADDRESS,
    // uri: "/api/graphql",
  }),
})

const SessionLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <SessionProvider>
    <SSEProvider>
      <ApolloProvider client={client}>
        {children}
        <Toaster
          richColors
          theme="light"
          visibleToasts={1}
          expand
          duration={3000}
          position="bottom-left"
        />
      </ApolloProvider>
    </SSEProvider>
  </SessionProvider>
)

export default SessionLayout
