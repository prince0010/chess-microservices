import React from "react"
import { Badge } from "./ui/badge"

type Props = {
  type: string
}

export default function StatusBadge({ type }: Props) {
  switch (type) {
    case "pending":
      return <Badge>Pending</Badge>
    case "endorsed":
      return <Badge className="bg-cyan-600">Endorsed</Badge>
    case "approved":
      return <Badge className="bg-green-800">Approved</Badge>
    case "departed":
      return <Badge className="bg-orange-600">Departed</Badge>
    case "completed":
      return <Badge className="bg-blue-800">Completed</Badge>
    case "rejected":
      return <Badge className="bg-red-800">Rejected</Badge>
    case "expired":
      return <Badge className="bg-slate-400">Expired</Badge>
    default:
      return <Badge variant="default">Unknown</Badge>
  }
}
