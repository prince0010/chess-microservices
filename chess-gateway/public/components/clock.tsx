import { cn } from "@/lib/utils"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"

export default function Clock({
  className,
  timeFormat,
}: {
  className?: string
  timeFormat?: string
}) {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(function () {
    setMounted(true)
    const interval = setInterval(function () {
      setTime(new Date())
    }, 1000)

    return function () {
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  return (
    <span className={cn(className)}>
      {format(time, timeFormat || "HH:mm:ss a")}
    </span>
  )
}
