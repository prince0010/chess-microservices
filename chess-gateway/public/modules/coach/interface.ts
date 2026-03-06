import { Document, ObjectId, Types } from "mongoose";
import { IPageInfo } from "../shared/interfaces";

export enum ChessTitle {
    NONE = "NONE",
    WORLD_CHAMPION = "WORLD_CHAMPION",
    GRANDMASTER = "GRANDMASTER",
    WOMAN_GRANDMASTER = "WOMAN_GRANDMASTER",
    INTERNATIONAL_MASTER = "INTERNATIONAL_MASTER",
    WOMAN_INTERNATIONAL_MASTER = "WOMAN_INTERNATIONAL_MASTER",
    FIDE_MASTER = "FIDE_MASTER",
    WOMAN_FIDE_MASTER = "WOMAN_FIDE_MASTER",
    CANDIDATE_MASTER = "CANDIDATE_MASTER",
    WOMAN_CANDIDATE_MASTER = "WOMAN_CANDIDATE_MASTER",
    ARENA_GRANDMASTER = "ARENA_GRANDMASTER",
    WOMAN_ARENA_GRANDMASTER = "WOMAN_ARENA_GRANDMASTER",
    ARENA_INTERNATIONAL_MASTER = "ARENA_INTERNATIONAL_MASTER",
    WOMAN_ARENA_INTERNATIONAL_MASTER = "WOMAN_ARENA_INTERNATIONAL_MASTER",
    ARENA_FIDE_MASTER = "ARENA_FIDE_MASTER",
    WOMAN_ARENA_FIDE_MASTER = "WOMAN_ARENA_FIDE_MASTER",
}

export enum CoachStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}

export interface ICoach extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    fideId?: string;
    chessTitle?: ChessTitle;
    photo?: string;
    hasStudentsOnApp: boolean;
    wantsToBeListed: boolean;
    cvFile: string;
    languages: string[];
    status: CoachStatus;
    isActive: boolean;
    applicationDate: Date;
    reviewedBy?: ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;
    price?: number;
    currency?: string;
    achievements?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICoachInput {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    fideId?: string;
    chessTitle?: ChessTitle;
    photo?: File;
    hasStudentsOnApp: string;
    wantsToBeListed: string;
    cvFile: File;
    languages: string[];
    status?: CoachStatus;
}

export interface ICoachNode {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    fideId?: string;
    chessTitle?: ChessTitle;
    photo?: string;
    hasStudentsOnApp: boolean;
    wantsToBeListed: boolean;
    languages: string[];
    status: CoachStatus;
    isActive: boolean;
    applicationDate: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    rejectionReason?: string;
    price?: number;
    currency?: string;
    achievements?: string[]
}

export interface ICoachEdge {
    node: ICoachNode;
    cursor: string;
}

export interface ICoachConnection {
    edges: ICoachEdge[];
    pageInfo: IPageInfo;
}

export interface ICoachOption {
    label: string;
    value: string;
}