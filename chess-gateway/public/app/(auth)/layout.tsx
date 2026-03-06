"use client"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import PageLoader from "@/components/page-loader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useFetchUser } from "@/modules/user/hooks"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // State to track if the session has been refreshed with latest user data
  const [hasRefreshed, setHasRefreshed] = useState(false)
  const { data: session, update, status }: any = useSession({ required: true })
  const { data: userData } = useFetchUser(session?.user?._id)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarOpen")
      return stored ? JSON.parse(stored) : true
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen))
    }
  }, [sidebarOpen])

  // Update session with fetched user data once, when available
  useEffect(() => {
    if (userData && !hasRefreshed) {
      update({ user: (userData as any)?.fetchUser })
      setHasRefreshed(true)
    }
  }, [userData, hasRefreshed, update])

  if (status === "loading" || !hasRefreshed) return <PageLoader />

  return (
    <main className="w-full h-screen flex">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  )
}

export default AuthLayout
