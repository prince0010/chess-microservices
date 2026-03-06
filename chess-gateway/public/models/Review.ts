import { IReview } from '@/modules/review/interface';
import mongoose, { model, models, Schema } from 'mongoose';

const ReviewSchema = new Schema<IReview>({
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, {
    timestamps: true
});

ReviewSchema.index({ bookingId: 1 }, { unique: true });
ReviewSchema.index({ coachId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });

export default models.Review || model<IReview>('Review', ReviewSchema);