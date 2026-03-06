import React from "react"
import { Badge } from "./ui/badge"

type Props = {
  type: string
}

export default function RoleBadge({ type }: Props) {
  switch (type) {
    case "admin":
      return <Badge className="bg-destructive">Admin</Badge>
    case "coach":
      return <Badge className="bg-green-700">Coach</Badge>
    case "user":
      return <Badge className="bg-blue-700">User</Badge>
    default:
      return <Badge variant="default">Unknown</Badge>
  }
}
