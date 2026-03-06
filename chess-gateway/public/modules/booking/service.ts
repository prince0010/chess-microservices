// modules/booking/service.ts
import Booking from "@/models/Booking";
import Coach from "@/models/Coach";
import User from "@/models/User";
import { ObjectId } from "mongoose";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { transporter } from "@/lib/mailer";
import { render } from "@react-email/components";
import { createElement } from "react";
import bcrypt from "bcryptjs";
import CustomerBookingEmail from "@/emails/customer-booking-email";
import CoachBookingEmail from "@/emails/coach-booking-email";
import AdminBookingEmail from "@/emails/admin-booking-email";
import { BookingStatus, IBookingFilter, IBookingInput, IBookingSort } from "./interface";
import UserAccountCreatedEmail from "@/emails/user-account-email";
import AdminNewBookingEmail from "@/emails/admin-new-booking-email";

class BookingService {
    async createBooking(input: IBookingInput) {
        try {
            const coach = await Coach.findById(input.coachId);
            if (!coach) throw new Error("Coach not found");

            const existingBooking = await Booking.findOne({ orderId: input.orderId });
            if (existingBooking) throw new Error("Booking already exists");

            // ==========================
            // CHECK IF USER EXISTS, CREATE IF NOT
            // ==========================
            let user = await User.findOne({ email: input.customerEmail });
            let isNewUser = false;
            let rawPassword = '';

            if (!user) {
                console.log("No existing user found, creating new user account for customer");

                // Create username from email (remove @ and domain)
                const username = input.customerEmail.split('@')[0];

                // Split customer name into first and last name
                const nameParts = input.customerName?.split(' ') || ['Student', 'User'];
                const firstName = nameParts[0] || 'Student';
                const lastName = nameParts.slice(1).join(' ') || 'User';

                // Create password: user + email without @ (remove special characters)
                const emailPrefix = input.customerEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
                rawPassword = `user${emailPrefix}`;

                console.log("Generated raw password:", rawPassword);

                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                user = await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: input.customerEmail,
                    password: hashedPassword,
                    role: 'user',
                    status: true,
                    isActive: true,
                });

                isNewUser = true;
                console.log("User created successfully with ID:", user._id);
            } else {
                console.log("Existing user found with ID:", user._id);
            }

            // ==========================
            // CREATE BOOKING
            // ==========================
            const booking = await Booking.create({
                coachId: input.coachId,
                customerEmail: input.customerEmail,
                customerPhone: input.customerPhone,
                customerName: input.customerName,
                duration: input.duration,
                amount: input.amount,
                currency: input.currency || coach.currency || "USD",
                orderId: input.orderId,
                payerId: input.payerId,
                coachName: `${coach.firstName} ${coach.lastName}`,
                coachEmail: coach.email,
                coachWhatsapp: coach.phoneNumber,
                userId: user._id,
                status: BookingStatus.CONFIRMED,
            });

            console.log("Booking created successfully with ID:", booking._id);

            // ==========================
            // SEND ALL EMAILS ASYNCHRONOUSLY (FIRE AND FORGET)
            // ==========================
            Promise.allSettled([
                // 1. Send welcome email for new users
                (async () => {
                    if (isNewUser && user) {
                        try {
                            console.log("Attempting to send welcome email to new user...");
                            const emailResult = await transporter.sendMail({
                                from: `"We Chess" <${process.env.SMTP_USER}>`,
                                to: user.email,
                                subject: "🎉 Your We Chess Account Has Been Created!",
                                html: await render(
                                    createElement(UserAccountCreatedEmail, {
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        email: user.email,
                                        username: user.username,
                                        password: rawPassword,
                                        loginUrl: `${process.env.NEXTAUTH_URL}/login`,
                                        coachName: `${coach.firstName} ${coach.lastName}`,
                                    })
                                ),
                            });
                            console.log("Welcome email sent successfully:", emailResult.messageId);
                        } catch (emailError) {
                            console.error("Failed to send welcome email:", emailError);
                        }
                    }
                })(),

                // 2. Send booking confirmation to customer
                (async () => {
                    try {
                        const customerEmailHtml = await render(
                            createElement(CustomerBookingEmail, {
                                customerName: booking.customerName || booking.customerEmail,
                                coachName: booking.coachName,
                                coachEmail: booking.coachEmail,
                                coachWhatsapp: booking.coachWhatsapp,
                                lessonCount: booking.duration,
                                amount: booking.amount,
                                currency: booking.currency,
                                orderId: booking.orderId
                            })
                        );

                        await transporter.sendMail({
                            from: `"We Chess" <${process.env.SMTP_USER}>`,
                            to: booking.customerEmail,
                            subject: `✅ Booking Successfully: Chess Lesson with ${booking.coachName}`,
                            html: customerEmailHtml,
                        });
                        console.log("Customer booking email sent successfully");
                    } catch (error) {
                        console.error('Failed to send customer email:', error);
                    }
                })(),

                (async () => {
                    try {
                        const coachEmailHtml = await render(
                            createElement(CoachBookingEmail, {
                                coachName: booking.coachName,
                                customerName: booking.customerName || booking.customerEmail,
                                customerEmail: booking.customerEmail,
                                amount: booking.amount,
                                lessonCount: booking.duration,
                                currency: booking.currency,
                                orderId: booking.orderId
                            })
                        );

                        await transporter.sendMail({
                            from: `"We Chess" <${process.env.SMTP_USER}>`,
                            to: booking.coachEmail,
                            subject: `🎯 New Booking: ${booking.customerEmail} booked ${booking.duration} hour${booking.duration > 1 ? 's' : ''}`,
                            html: coachEmailHtml,
                        });
                        console.log("Coach booking email sent successfully");
                    } catch (error) {
                        console.error('Failed to send coach email:', error);
                    }
                })(),

                // 4. Send notification to admin (info@we-chess.com)
                (async () => {
                    try {
                        const adminEmailHtml = await render(
                            createElement(AdminNewBookingEmail, {
                                coachName: booking.coachName,
                                coachEmail: booking.coachEmail,
                                customerEmail: booking.customerEmail,
                                customerName: booking.customerName,
                                customerPhone: booking.customerPhone,
                                duration: booking.duration,
                                amount: booking.amount,
                                currency: booking.currency,
                                orderId: booking.orderId,
                                isNewUser: isNewUser
                            })
                        );

                        await transporter.sendMail({
                            from: `"We Chess" <${process.env.SMTP_USER}>`,
                            to: 'info@we-chess.com',
                            subject: `💰 New Booking: ${booking.coachName} - ${booking.customerEmail} - ${booking.currency}${booking.amount}`,
                            html: adminEmailHtml,
                        });
                        console.log("Admin booking notification sent successfully");
                    } catch (error) {
                        console.error('Failed to send admin email:', error);
                    }
                })()
            ]).then(results => {
                console.log("All booking emails processed:", results);
            });

            return booking;
        } catch (error) {
            console.error("Create booking error:", error);
            throw error;
        }
    }

    // ============= READ =============
    async fetchBookingById(id: string) {
        try {
            const booking = await Booking.findById(id);
            if (!booking) throw new Error("Booking not found");
            return booking;
        } catch (error) {
            console.error("Fetch booking error:", error);
            throw error;
        }
    }

    async fetchAllBookings() {
        try {
            return await Booking.find().sort({ createdAt: -1 });
        } catch (error) {
            console.error("Fetch all bookings error:", error);
            throw error;
        }
    }

    async fetchCustomerBookings(email: string) {
        try {
            return await Booking.find({ customerEmail: email })
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error("Fetch customer bookings error:", error);
            throw error;
        }
    }

    async fetchCoachBookings(coachId: string) {
        try {
            return await Booking.find({ coachId })
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error("Fetch coach bookings error:", error);
            throw error;
        }
    }

    async fetchBookingTable({
        first = 10,
        after,
        search,
        filter,
        sort = { key: "createdAt", order: "DESC" }
    }: {
        first?: number;
        after?: string;
        search?: string;
        filter?: IBookingFilter[];
        sort?: IBookingSort;
    }) {
        try {
            const matchStage: Record<string, any> = {};

            if (search) {
                matchStage.$or = [
                    { coachName: { $regex: search, $options: "i" } },
                    { coachEmail: { $regex: search, $options: "i" } },
                    { customerEmail: { $regex: search, $options: "i" } },
                    { customerName: { $regex: search, $options: "i" } },
                    { orderId: { $regex: search, $options: "i" } }
                ];
            }

            if (filter && filter.length > 0) {
                matchStage.$and = filter.map(({ key, term, type }) => {
                    switch (type) {
                        case "TEXT":
                            return { [key]: { $regex: term, $options: "i" } };
                        case "DATE":
                            const dates = term.split("_");
                            if (dates.length === 2) {
                                const from = startOfDay(parseISO(dates[0]));
                                const to = endOfDay(parseISO(dates[1]));
                                return { [key]: { $gte: from, $lte: to } };
                            }
                            return { [key]: { $gte: startOfDay(parseISO(term)) } };
                        case "RANGE":
                            const [min, max] = term.split("_").map(Number);
                            if (min && max) {
                                return { [key]: { $gte: min, $lte: max } };
                            }
                            return { [key]: { $gte: min || 0 } };
                        case "SELECT":
                            if (key === "status") {
                                return { [key]: term };
                            }
                            return { [key]: term };
                        default:
                            return { [key]: term };
                    }
                });
            }

            if (after) {
                const doc = await Booking.findById(after);
                if (doc && sort.key) {
                    matchStage[sort.key] = {
                        [sort.order === "ASC" ? "$gt" : "$lt"]: doc[sort.key as keyof typeof doc]
                    };
                }
            }

            const bookings = await Booking.aggregate([
                { $match: matchStage },
                { $sort: { [sort.key]: sort.order === "ASC" ? 1 : -1 } },
                { $limit: first + 1 },
                {
                    $project: {
                        _id: 1,
                        coachId: 1,
                        coachName: 1,
                        coachEmail: 1,
                        coachWhatsapp: 1,
                        customerEmail: 1,
                        customerPhone: 1,
                        customerName: 1,
                        duration: 1,
                        amount: 1,
                        currency: 1,
                        orderId: 1,
                        payerId: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        userId: 1
                    }
                }
            ]);

            const edges = bookings
                .slice(0, first)
                .map((booking) => ({
                    node: booking,
                    cursor: booking._id.toString()
                }));

            const totalStage = { ...matchStage };
            if (totalStage[sort.key]) delete totalStage[sort.key];

            const total = await Booking.aggregate([
                { $match: totalStage },
                { $count: "count" }
            ]);

            const totalCount = total.length > 0 ? total[0].count : 0;

            return {
                edges,
                pageInfo: {
                    total: totalCount,
                    hasNextPage: bookings.length > first,
                    endCursor: edges.length ? edges[edges.length - 1].node._id.toString() : null
                }
            };
        } catch (error) {
            console.error("Fetch booking table error:", error);
            throw error;
        }
    }

    async fetchBookingStats(startDate?: Date, endDate?: Date) {
        try {
            const matchStage: Record<string, any> = {};

            if (startDate || endDate) {
                matchStage.createdAt = {};
                if (startDate) matchStage.createdAt.$gte = startDate;
                if (endDate) matchStage.createdAt.$lte = endDate;
            }

            const bookings = await Booking.find(matchStage);

            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
            const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
            const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
            const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

            const coachMap = new Map();

            for (const booking of bookings) {
                const coachId = booking.coachId.toString();
                if (!coachMap.has(coachId)) {
                    const coach = await Coach.findById(coachId);
                    coachMap.set(coachId, {
                        coachId,
                        coachName: booking.coachName || (coach ? `${coach.firstName} ${coach.lastName}` : 'Unknown'),
                        totalBookings: 0,
                        totalRevenue: 0,
                        totalHours: 0
                    });
                }

                const stats = coachMap.get(coachId);
                stats.totalBookings += 1;
                stats.totalRevenue += booking.amount;
                stats.totalHours += booking.duration;
            }

            const bookingsByCoach = Array.from(coachMap.values())
                .sort((a, b) => b.totalRevenue - a.totalRevenue);

            const recentBookings = await Booking.find(matchStage)
                .sort({ createdAt: -1 })
                .limit(10);

            return {
                totalBookings,
                totalRevenue,
                completedBookings,
                cancelledBookings,
                averageBookingValue,
                bookingsByCoach,
                recentBookings
            };
        } catch (error) {
            console.error("Fetch booking stats error:", error);
            throw error;
        }
    }

    // ============= UPDATE =============
    async updateBookingStatus(id: string, status: BookingStatus, reviewerId?: ObjectId) {
        try {
            const booking = await Booking.findByIdAndUpdate(
                id,
                {
                    status,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );

            if (!booking) throw new Error("Booking not found");
            return booking;
        } catch (error) {
            console.error("Update booking status error:", error);
            throw error;
        }
    }

    async cancelBooking(id: string, reason?: string) {
        try {
            const booking = await Booking.findByIdAndUpdate(
                id,
                {
                    status: BookingStatus.CANCELLED,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!booking) throw new Error("Booking not found");

            await this.sendCancellationEmails(booking, reason);

            return booking;
        } catch (error) {
            console.error("Cancel booking error:", error);
            throw error;
        }
    }

    // ============= DELETE =============
    async deleteBooking(id: string) {
        try {
            const booking = await Booking.findByIdAndDelete(id);
            if (!booking) throw new Error("Booking not found");
            return booking;
        } catch (error) {
            console.error("Delete booking error:", error);
            throw error;
        }
    }

    async deleteMultipleBookings(ids: ObjectId[]) {
        try {
            const result = await Booking.deleteMany({ _id: { $in: ids } });
            return result.deletedCount;
        } catch (error) {
            console.error("Delete multiple bookings error:", error);
            throw error;
        }
    }

    // ============= EMAILS =============
    async sendBookingEmails(booking: any) {
        const {
            coachName,
            coachEmail,
            coachWhatsapp,
            customerEmail,
            customerPhone,
            customerName,
            duration,
            amount,
            currency,
            orderId
        } = booking;

        const emailPromises = [];

        // 1. Customer Email
        try {
            const customerEmailHtml = await render(
                createElement(CustomerBookingEmail, {
                    customerName: customerName || customerEmail,
                    coachName,
                    coachEmail,
                    coachWhatsapp,
                    lessonCount: duration,
                    amount,
                    currency,
                    orderId
                })
            );

            emailPromises.push(
                transporter.sendMail({
                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                    to: customerEmail,
                    subject: `✅ Booking Successfully: Chess Lesson with ${coachName}`,
                    html: customerEmailHtml,
                }).catch(err => console.error('Failed to send customer email:', err))
            );
        } catch (error) {
            console.error('Error preparing customer email:', error);
        }

        // 2. Coach Email
        try {
            const coachEmailHtml = await render(
                createElement(CoachBookingEmail, {
                    coachName,
                    customerName: customerName || customerEmail,
                    customerEmail,
                    amount,
                    lessonCount: duration,
                    currency,
                    orderId
                })
            );

            emailPromises.push(
                transporter.sendMail({
                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                    to: coachEmail,
                    subject: `🎯 New Booking: ${customerEmail} booked ${duration} hour${duration > 1 ? 's' : ''}`,
                    html: coachEmailHtml,
                }).catch(err => console.error('Failed to send coach email:', err))
            );
        } catch (error) {
            console.error('Error preparing coach email:', error);
        }

        // 3. Admin Email
        try {
            const adminEmailHtml = await render(
                createElement(AdminBookingEmail, {
                    coachName,
                    coachEmail,
                    customerEmail,
                    customerPhone,
                    duration,
                    lessonCount: duration,
                    amount,
                    currency,
                    orderId
                })
            );

            emailPromises.push(
                transporter.sendMail({
                    from: `"We Chess Bookings" <${process.env.SMTP_USER}>`,
                    to: 'info@we-chess.com',
                    subject: `💰 New Booking: ${coachName} - ${customerEmail} - ${currency}${amount}`,
                    html: adminEmailHtml,
                }).catch(err => console.error('Failed to send admin email:', err))
            );
        } catch (error) {
            console.error('Error preparing admin email:', error);
        }

        await Promise.allSettled(emailPromises);
        return booking;
    }

    async sendCancellationEmails(booking: any, reason?: string) {
        console.log('Cancellation emails would be sent:', booking._id, reason);
    }
}

const bookingService = new BookingService();
export default bookingService;