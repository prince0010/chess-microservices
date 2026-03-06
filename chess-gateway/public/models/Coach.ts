import { ChessTitle, CoachStatus, ICoach } from "@/modules/coach/interface";
import mongoose, { Schema } from "mongoose";

const CoachSchema = new Schema<ICoach>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true },
        fideId: { type: String, sparse: true, unique: true },
        chessTitle: {
            type: String,
            enum: Object.values(ChessTitle),
            default: ChessTitle.NONE
        },
        photo: { type: String },
        hasStudentsOnApp: { type: Boolean, required: true },
        wantsToBeListed: { type: Boolean, required: true },
        cvFile: { type: String, required: true },
        languages: [{ type: String, required: true }],
        status: {
            type: String,
            enum: Object.values(CoachStatus),
            default: CoachStatus.PENDING,
            required: true
        },
        isActive: { type: Boolean, default: true },
        applicationDate: { type: Date, default: Date.now, required: true },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
        rejectionReason: { type: String },
        price: { type: Number, min: 0 },
        currency: { type: String, default: "USD" },
        achievements: [{ type: String }],
    },
    { timestamps: true }
);

CoachSchema.index({ email: 1 });
CoachSchema.index({ status: 1 });
CoachSchema.index({ applicationDate: -1 });
CoachSchema.index({ firstName: 1, lastName: 1 });
CoachSchema.index({ price: 1 });

const Coach = mongoose.models.Coach || mongoose.model<ICoach>("Coach", CoachSchema);
export default Coach;