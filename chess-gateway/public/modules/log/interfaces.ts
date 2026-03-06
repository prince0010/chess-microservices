import { Document, ObjectId, Types } from "mongoose"
import { IPageInfo } from "../shared/interfaces"
import { IUser } from "../user/interfaces"

export interface ILog extends Document {
  _id: Types.ObjectId
  user: IUser
  action: string
}

export interface ILogInput extends Request {
  _id?: ObjectId
  user: IUser
  action: string
}

export interface ILogEdge {
  node: ILog
  cursor: string
}

export interface ILogConnection {
  edges: ILogEdge[]
  pageInfo: IPageInfo
}
