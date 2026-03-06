import { ObjectId } from "mongoose";
import { IContext } from "../shared/interfaces";
import Log from "@/models/Log";
import { sseStore } from "@/lib/sse-store";
import BookingService from "./service";
import { BookingStatus } from "./interface";

const bookingResolvers = {
    Query: {
        fetchBooking: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
            try {
                const booking = await BookingService.fetchBookingById(_id);
                if (!booking) throw new Error("Booking not found");
                return booking;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchBookings: async (_: any, __: any, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to view all bookings");
            }

            try {
                const bookings = await BookingService.fetchAllBookings();
                return bookings;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchCustomerBookings: async (_: any, { email }: { email: string }, ctx: IContext) => {
            try {
                const bookings = await BookingService.fetchCustomerBookings(email);
                return bookings;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchCoachBookings: async (_: any, { coachId }: { coachId: string }, ctx: IContext) => {
            try {
                const bookings = await BookingService.fetchCoachBookings(coachId);
                return bookings;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchBookingTable: async (
            _: any,
            params: {
                first?: number;
                after?: string;
                search?: string;
                filter?: Array<{ key: string; term: string; type: "TEXT" | "SELECT" | "DATE" | "RANGE" }>;
                sort?: { key: string; order: "ASC" | "DESC" };
            },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to view booking table");
            }

            try {
                const bookingTable = await BookingService.fetchBookingTable(params);
                return bookingTable;
            } catch (error: any) {
                console.error("Error in fetchBookingTable resolver:", error);
                throw new Error(error.toString());
            }
        },

        fetchBookingStats: async (
            _: any,
            { startDate, endDate }: { startDate?: Date; endDate?: Date },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to view booking stats");
            }

            try {
                const stats = await BookingService.fetchBookingStats(startDate, endDate);
                return stats;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        }
    },

    Mutation: {
        createBooking: async (
            _: any,
            { input }: { input: any },
            ctx: IContext
        ) => {
            try {
                if (!input.coachId) throw new Error("Coach ID is required");
                if (!input.customerEmail) throw new Error("Customer email is required");
                if (!input.orderId) throw new Error("Order ID is required");
                if (!input.amount) throw new Error("Amount is required");
                if (input.duration < 1 || input.duration > 10) {
                    throw new Error("Duration must be between 1 and 10 hours");
                }

                const booking = await BookingService.createBooking(input);
                if (!booking) throw new Error("Failed to create booking");

                // BookingService.sendBookingEmails(booking).catch(err => {
                //     console.error("Failed to send booking emails:", err);
                // });

                if (ctx?.session) {
                    await Log.create({
                        user: ctx.session.user._id as unknown as ObjectId,
                        action: `New booking created: ${booking.coachName} - ${booking.customerEmail} - $${booking.amount}`,
                        type: "BOOKING_CREATE"
                    });
                }

                const eventData = {
                    type: "BOOKING_CREATED",
                    payload: {
                        refetch: true,
                        message: `New booking: ${booking.coachName} - ${booking.customerEmail} - $${booking.amount}`,
                        roles: ["admin"],
                        bookingId: booking._id.toString()
                    }
                };
                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: "Booking created successfully",
                    bookingId: booking._id.toString(),
                    booking
                };
            } catch (error: any) {
                console.error("Create booking error:", error);
                throw new Error(error.message || "Failed to create booking");
            }
        },

        updateBookingStatus: async (
            _: any,
            { input }: { input: { _id: string; status: BookingStatus } },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to update booking status");
            }

            try {
                const booking = await BookingService.updateBookingStatus(
                    input._id,
                    input.status,
                    ctx.session.user._id as unknown as ObjectId
                );

                await Log.create({
                    user: ctx.session.user._id as unknown as ObjectId,
                    action: `Booking status updated: ${booking._id} -> ${input.status}`,
                    type: "BOOKING_UPDATE"
                });

                const eventData = {
                    type: "BOOKING_UPDATED",
                    payload: {
                        refetch: true,
                        message: `Booking ${booking._id} status changed to ${input.status}`,
                        roles: ["admin"],
                        bookingId: booking._id.toString()
                    }
                };
                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: `Booking status updated to ${input.status}`,
                    bookingId: booking._id.toString(),
                    booking
                };
            } catch (error: any) {
                console.error(error);
                throw new Error(error.message || "Failed to update booking status");
            }
        },

        deleteBooking: async (
            _: any,
            { _id }: { _id: string },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to delete bookings");
            }

            try {
                const booking = await BookingService.deleteBooking(_id);
                if (!booking) throw new Error("Failed to delete booking");

                await Log.create({
                    user: ctx.session.user._id as unknown as ObjectId,
                    action: `Booking deleted: ${_id}`,
                    type: "BOOKING_DELETE"
                });

                const eventData = {
                    type: "BOOKING_DELETED",
                    payload: {
                        refetch: true,
                        message: `Booking ${_id} has been deleted`,
                        roles: ["admin", "hr"]
                    }
                };
                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: "Booking deleted successfully",
                    bookingId: _id
                };
            } catch (error: any) {
                console.error(error);
                throw new Error(error.message || "Failed to delete booking");
            }
        },

        deleteMultipleBookings: async (
            _: any,
            { ids }: { ids: ObjectId[] },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            if (!["admin", "hr"].includes(ctx.session.user.role)) {
                throw new Error("Unauthorized to delete bookings");
            }

            try {
                const deletedCount = await BookingService.deleteMultipleBookings(ids);

                await Log.create({
                    user: ctx.session.user._id as unknown as ObjectId,
                    action: `Deleted ${deletedCount} bookings in batch`,
                    type: "BOOKING_BATCH_DELETE"
                });

                const eventData = {
                    type: "BOOKINGS_DELETED",
                    payload: {
                        refetch: true,
                        message: `Deleted ${deletedCount} bookings`,
                        roles: ["admin", "hr"]
                    }
                };
                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: `Successfully deleted ${deletedCount} booking${deletedCount > 1 ? 's' : ''}`,
                    bookingId: null
                };
            } catch (error: any) {
                console.error(error);
                throw new Error("Failed to delete bookings");
            }
        }
    }
};

export default bookingResolvers;