import { BookingStatus, IBooking } from '@/modules/booking/interface';
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ObjectId } from 'mongoose';

const BookingSchema = new Schema<IBooking>({
    coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    coachName: { type: String, required: true },
    coachEmail: { type: String, required: true },
    coachWhatsapp: { type: String },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String },
    customerName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    duration: { type: Number, required: true, min: 1, max: 10 },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    orderId: { type: String, required: true, unique: true },
    payerId: { type: String },
    status: {
        type: String,
        enum: BookingStatus,
        default: BookingStatus.PENDING
    },
}, {
    timestamps: true
});

BookingSchema.index({ coachId: 1, createdAt: -1 });
BookingSchema.index({ customerEmail: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);