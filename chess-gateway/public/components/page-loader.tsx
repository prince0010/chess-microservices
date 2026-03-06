import { Loader2 } from "lucide-react"
import React from "react"

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin size-15" />
    </div>
  )
}
