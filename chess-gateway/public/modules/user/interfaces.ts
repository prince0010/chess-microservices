// modules/user/interfaces.ts
import { Document, ObjectId, Types } from "mongoose"
import { IPageInfo, TRole } from "../shared/interfaces"

export interface IUser extends Document {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  role: TRole
  coachId?: Types.ObjectId
  status: boolean
  isActive: boolean
}

export interface IUserInput extends Request {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  role: TRole
  coachId?: Types.ObjectId
  status: boolean
  isActive: boolean
}

export interface IUserNode {
  id: ObjectId
  firstName: string
  lastName: string
  username: string
  email: string
  role: TRole
  coachId?: string
  status: boolean
  isActive: boolean
}

export interface IUserEdge {
  node: IUserNode
  cursor: string
}

export interface IUserConnection {
  edges: IUserEdge[]
  pageInfo: IPageInfo
}