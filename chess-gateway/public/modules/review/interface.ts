import { Document, Types } from "mongoose";

export interface IReview extends Document {
    _id: Types.ObjectId;
    bookingId: Types.ObjectId;
    coachId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewInput {
    bookingId: string;
    coachId: string;
    userId: string;
    rating: number;
    comment: string;
}

export interface IReviewResponse {
    ok: boolean;
    message: string;
    reviewId?: string;
}

