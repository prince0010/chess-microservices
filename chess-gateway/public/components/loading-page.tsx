// import { Loader } from "lucide-react"
import React from "react"
import { Spinner } from "./ui/spinner"

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner className="size-32" />
    </div>
  )
}

export default Loading
