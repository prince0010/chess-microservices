import { Document, ObjectId, Types } from "mongoose";
import { IPageInfo } from "../shared/interfaces";

export enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}

export interface IBooking extends Document {
    _id: Types.ObjectId;
    coachId: Types.ObjectId;
    coachName: string;
    coachEmail: string;
    coachWhatsapp?: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
    userId?: Types.ObjectId;
    duration: number;
    amount: number;
    currency: string;
    orderId: string;
    payerId?: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBookingInput {
    coachId: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
    duration: number;
    amount: number;
    currency?: string;
    orderId: string;
    payerId?: string;
}

export interface IBookingNode {
    _id: string;
    coachId: string;
    coachName: string;
    coachEmail: string;
    coachWhatsapp?: string;
    customerEmail: string;
    customerPhone?: string;
    customerName?: string;
    userId?: string;
    duration: number;
    amount: number;
    currency: string;
    orderId: string;
    payerId?: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBookingEdge {
    node: IBookingNode;
    cursor: string;
}

export interface IBookingConnection {
    edges: IBookingEdge[];
    pageInfo: IPageInfo;
}

export interface IBookingFilter {
    key: string;
    term: string;
    type: "TEXT" | "SELECT" | "DATE" | "RANGE";
}

export interface IBookingSort {
    key: string;
    order: "ASC" | "DESC";
}