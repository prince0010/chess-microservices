export const Roles = ["admin", "user", "coach"] as const
export const Passes = ["itinerary", "vehicle", "sick_leave", "emergency"]
export const RequestStatuses = [
  "pending",
  "endorsed",
  "approved",
  "departed",
  "completed",
  "rejected",
  "expired",
] as const
export const NotificationTypes = [
  "info",
  "warning",
  "error",
  "success",
] as const
