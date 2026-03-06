import { IUser } from "../user/interfaces"

export type TRole = "admin" | "user" | "coach"
export type TPass = "itinerary" | "vehicle" | "sick_leave" | "emergency"
export type TFilterType = "TEXT" | "SELECT" | "DATE"
export type TSortOrder = "ASC" | "DESC"
export type TRequestStatus =
  | "pending"
  | "endorsed"
  | "approved"
  | "departed"
  | "completed"
  | "rejected"
  | "expired"

export interface IContext {
  req: Request
  session: {
    user: IUser
    iat: number
    exp: number
    jti: string
  }
}

export interface IFilterState {
  key: string
  type: TFilterType
  term: string
}

export interface ISortState {
  key: string
  order: TSortOrder
}

export interface IPageInfo {
  total: number
  hasNextPage: boolean
  endCursor: string | null
}

// Dropdown Menu
export interface IOption {
  value: string
  label: string
}
