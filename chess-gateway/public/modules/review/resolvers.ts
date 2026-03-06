import { ObjectId } from "mongoose";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Coach from "@/models/Coach";
import { IContext } from "../shared/interfaces";

const reviewResolvers = {
    Query: {
        fetchReview: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
            try {
                const review = await Review.findById(_id);
                if (!review) throw new Error("Review not found");
                return review;
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch review");
            }
        },

        fetchCoachReviews: async (_: any, { coachId }: { coachId: string }, ctx: IContext) => {
            try {
                return await Review.find({ coachId }).sort({ createdAt: -1 });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch coach reviews");
            }
        },

        fetchUserReviews: async (_: any, { userId }: { userId: string }, ctx: IContext) => {
            try {
                return await Review.find({ userId }).sort({ createdAt: -1 });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch user reviews");
            }
        },

        fetchBookingReview: async (_: any, { bookingId }: { bookingId: string }, ctx: IContext) => {
            try {
                return await Review.findOne({ bookingId });
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch booking review");
            }
        },
    },

    Mutation: {
        createReview: async (_: any, { input }: { input: any }, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");

            try {
                // Check if booking exists
                const booking = await Booking.findById(input.bookingId);
                if (!booking) throw new Error("Booking not found");

                // Check if booking is completed
                // if (booking.status !== "completed") {
                //     throw new Error("Can only review completed bookings");
                // }

                // Check if user owns this booking
                if (booking.userId?.toString() !== input.userId) {
                    throw new Error("You can only review your own bookings");
                }

                // Check if review already exists for this booking
                const existingReview = await Review.findOne({ bookingId: input.bookingId });
                if (existingReview) {
                    throw new Error("Review already exists for this booking");
                }

                const review = await Review.create({
                    bookingId: input.bookingId,
                    coachId: input.coachId,
                    userId: input.userId,
                    rating: input.rating,
                    comment: input.comment,
                });

                return {
                    ok: true,
                    message: "Review created successfully",
                    reviewId: review._id.toString(),
                };
            } catch (error: any) {
                console.error(error);
                return {
                    ok: false,
                    message: error.message || "Failed to create review",
                };
            }
        },

        updateReview: async (_: any, { _id, rating, comment }: { _id: string; rating?: number; comment?: string }, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");

            try {
                const review = await Review.findById(_id);
                if (!review) throw new Error("Review not found");

                // Check if user owns this review
                if (review.userId.toString() !== ctx.session.user._id) {
                    throw new Error("You can only update your own reviews");
                }

                const updateData: any = {};
                if (rating !== undefined) updateData.rating = rating;
                if (comment !== undefined) updateData.comment = comment;

                await Review.findByIdAndUpdate(_id, updateData);

                return {
                    ok: true,
                    message: "Review updated successfully",
                };
            } catch (error: any) {
                console.error(error);
                return {
                    ok: false,
                    message: error.message || "Failed to update review",
                };
            }
        },

        deleteReview: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");

            try {
                const review = await Review.findById(_id);
                if (!review) throw new Error("Review not found");

                // Check if user owns this review
                if (review.userId.toString() !== ctx.session.user._id) {
                    throw new Error("You can only delete your own reviews");
                }

                await Review.findByIdAndDelete(_id);

                return {
                    ok: true,
                    message: "Review deleted successfully",
                };
            } catch (error: any) {
                console.error(error);
                return {
                    ok: false,
                    message: error.message || "Failed to delete review",
                };
            }
        },
    },

    Review: {
        user: async (parent: any) => {
            return await User.findById(parent.userId);
        },
        coach: async (parent: any) => {
            return await Coach.findById(parent.coachId);
        },
        booking: async (parent: any) => {
            return await Booking.findById(parent.bookingId);
        },
    },
};

export default reviewResolvers;