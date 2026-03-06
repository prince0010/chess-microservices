import React from "react"
import { Badge } from "./ui/badge"

type Props = {
  type: string
}

export default function TypeBadge({ type }: Props) {
  switch (type) {
    case "itinerary":
      return <Badge className="bg-green-700">Itinerary</Badge>
    case "vehicle":
      return <Badge className="bg-orange-600">Vehicle</Badge>
    case "sick_leave":
      return <Badge className="bg-blue-700">Sick Leave</Badge>
    case "emergency":
      return <Badge className="bg-red-700">Emergency</Badge>
    default:
      return <Badge variant="default">Unknown</Badge>
  }
}
