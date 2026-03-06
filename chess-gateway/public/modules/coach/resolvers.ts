import { ObjectId } from "mongoose";
import coachService from "./services";
import { IContext } from "../shared/interfaces";
import Log from "@/models/Log";
import { sseStore } from "@/lib/sse-store";
import { Readable } from 'stream';
import { uploadToCloudinary } from "@/lib/cloudinary";
import { CoachStatus } from "./interface";
import { transporter } from "@/lib/mailer";
import { render } from "@react-email/components"
import { createElement } from "react";
import PendingCoachEmail from "@/emails/pending";
import VerifiedCoachEmail from "@/emails/verify-email";
import RejectedCoachEmail from "@/emails/rejected-email";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import CoachAccountCreatedEmail from "@/emails/email-account-created";
import AdminNewCoachApplicationEmail from "@/emails/admin-new-coach-application-pending";
import AdminCoachVerifiedEmail from "@/emails/admin-coach-verified-email";
import AdminCoachRejectedEmail from "@/emails/admin-coach-rejected-email";

const coachResolvers = {
    Query: {
        fetchCoach: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
            try {
                const coach = await coachService.fetchCoachById(_id);
                if (!coach) throw new Error("Coach not found");
                return coach;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        // ADD THIS NEW RESOLVER
        fetchCoachByEmail: async (_: any, { email }: { email: string }, ctx: IContext) => {
            try {
                console.log("Fetching coach by email:", email);
                const coach = await coachService.fetchCoachByEmail(email);
                if (!coach) throw new Error("Coach not found");
                return coach;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchCoaches: async (_: any, __: any, ctx: IContext) => {
            try {
                const coaches = await coachService.fetchAllCoaches();
                if (!coaches) throw new Error("No coaches found");
                return coaches;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchCoachOptions: async (_: any, __: any, ctx: IContext) => {
            try {
                const options = await coachService.fetchCoachOptions();
                if (!options) throw new Error("No coach options found");
                return options;
            } catch (error: any) {
                console.error(error);
                throw new Error(error.toString());
            }
        },

        fetchCoachTable: async (
            _: any,
            params: {
                first?: number;
                after?: string;
                search?: string;
                filter?: Array<{ key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }>;
                sort?: { key: string; order: "ASC" | "DESC" };
            },
            ctx: IContext
        ) => {
            try {
                console.log("==== FETCH COACH TABLE DEBUG ====");
                console.log("Received params:", JSON.stringify(params, null, 2));

                const coachTable = await coachService.fetchCoachTable(params);
                if (!coachTable) throw new Error("No coach table data found");

                console.log("Returning coachTable with", coachTable.edges?.length || 0, "edges");

                return coachTable;
            } catch (error: any) {
                console.error("Error in fetchCoachTable resolver:", error);
                throw new Error(error.toString());
            }
        }
    },

    Mutation: {
        createCoach: async (
            _: any,
            { input, photo, cvFile }: { input: any; photo?: string; cvFile: string },
            ctx: IContext
        ) => {
            try {
                if (!cvFile) {
                    throw new Error("CV file is required");
                }

                let photoUrl: string | undefined;
                let cvUrl: string | undefined;

                // ==========================
                // PHOTO UPLOAD (Optional)
                // ==========================
                if (photo) {
                    try {
                        const matches = photo.match(/^data:(.+);base64,(.+)$/);
                        if (!matches || matches.length !== 3) {
                            throw new Error("Invalid photo data format");
                        }

                        const mimeType = matches[1];
                        const base64Data = matches[2];
                        const buffer = Buffer.from(base64Data, "base64");

                        let extension = "jpg";
                        if (mimeType.includes("png")) extension = "png";
                        if (mimeType.includes("jpeg")) extension = "jpg";

                        const photoFile = {
                            filename: `coach-photo-${Date.now()}.${extension}`,
                            mimetype: mimeType,
                            encoding: "7bit",
                            createReadStream: () => {
                                const stream = new Readable();
                                stream.push(buffer);
                                stream.push(null);
                                return stream;
                            },
                        };

                        photoUrl = await uploadToCloudinary(photoFile, "coach_photos");
                    } catch (photoError) {
                        console.error("Photo upload error:", photoError);
                    }
                }

                // ==========================
                // CV FILE UPLOAD (Required)
                // ==========================
                try {
                    const matches = cvFile.match(/^data:(.+);base64,(.+)$/);
                    if (!matches || matches.length !== 3) {
                        throw new Error("Invalid CV file data format");
                    }

                    const mimeType = matches[1];
                    const base64Data = matches[2];
                    const buffer = Buffer.from(base64Data, "base64");

                    let extension = "pdf";
                    if (mimeType.includes("msword")) extension = "doc";
                    if (mimeType.includes("vnd.openxmlformats-officedocument.wordprocessingml.document")) extension = "docx";

                    const cvFileObj = {
                        filename: `coach-cv-${Date.now()}.${extension}`,
                        mimetype: mimeType,
                        encoding: "7bit",
                        createReadStream: () => {
                            const stream = new Readable();
                            stream.push(buffer);
                            stream.push(null);
                            return stream;
                        },
                    };

                    cvUrl = await uploadToCloudinary(cvFileObj, "coach_cvs");
                } catch (cvError) {
                    console.error("CV upload error:", cvError);
                    throw new Error("Failed to upload CV file");
                }

                if (!cvUrl) {
                    throw new Error("CV file upload failed");
                }

                // Remove status from input (force default PENDING)
                const { status, ...cleanInput } = input;

                // ==========================
                // CREATE COACH
                // ==========================
                const coach = await coachService.createCoach(cleanInput, photoUrl, cvUrl);
                if (!coach) throw new Error("Failed to create coach");

                // ==========================
                // SEND EMAILS ASYNCHRONOUSLY (FIRE AND FORGET)
                // ==========================
                // Don't await these - let them run in the background
                Promise.allSettled([
                    // Send email to coach
                    (async () => {
                        try {
                            await transporter.sendMail({
                                from: `"We Chess" <${process.env.SMTP_USER}>`,
                                to: coach.email || cleanInput.email,
                                subject: "Pending Application For Coach",
                                html: await render(
                                    createElement(PendingCoachEmail, {
                                        name: `${coach.firstName} ${coach.lastName}`,
                                    })
                                ),
                            });
                            console.log("Pending coach email sent successfully");
                        } catch (emailError) {
                            console.error("Failed to send pending coach email:", emailError);
                        }
                    })(),

                    // Send email to admin
                    (async () => {
                        try {
                            await transporter.sendMail({
                                from: `"We Chess" <${process.env.SMTP_USER}>`,
                                to: 'info@we-chess.com',
                                subject: `New Coach Application: ${coach.firstName} ${coach.lastName}`,
                                html: await render(
                                    createElement(AdminNewCoachApplicationEmail, {
                                        name: `${coach.firstName} ${coach.lastName}`,
                                        email: coach.email,
                                        phoneNumber: coach.phoneNumber,
                                        chessTitle: coach.chessTitle,
                                        fideId: coach.fideId,
                                        languages: coach.languages,
                                        bio: coach.bio,
                                        hourlyRate: coach.hourlyRate,
                                        currency: coach.currency,
                                    })
                                ),
                            });
                            console.log("Admin notification email sent successfully");
                        } catch (adminEmailError) {
                            console.error("Failed to send admin notification email:", adminEmailError);
                        }
                    })()
                ]).then(results => {
                    // Log results but don't affect response
                    console.log("Email sending completed:", results);
                });

                // ==========================
                // SSE NOTIFICATION (ADMIN/HR)
                // ==========================
                const eventData = {
                    type: "COACH_APPLICATION",
                    payload: {
                        refetch: true,
                        message: `New coach application from ${coach.firstName} ${coach.lastName} is pending review`,
                        roles: ["admin"],
                    },
                };

                sseStore.broadcast(eventData);

                // Return immediately without waiting for emails
                return {
                    ok: true,
                    message: "Coach application submitted successfully and is pending review",
                };
            } catch (error: any) {
                console.error("Create coach error:", error);

                if (error.message.includes("duplicate key error") || error.code === 11000) {
                    if (error.message.includes("email")) {
                        throw new Error("Email address is already registered");
                    } else if (error.message.includes("fideId")) {
                        throw new Error("FIDE ID is already registered");
                    }
                }

                throw new Error(error.message || "Failed to create coach application");
            }
        },

        updateCoach: async (_: any, { input }: { input: any }, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            const sessionUser = ctx.session.user;

            try {
                // Remove status and review fields from update
                const { status, reviewedBy, reviewedAt, rejectionReason, ...updateData } = input;

                const coach = await coachService.updateCoach(input._id, updateData);
                if (!coach) throw new Error("Failed to update coach");

                await Log.create({
                    user: sessionUser._id as unknown as ObjectId,
                    action: `Coach updated: ${coach.firstName} ${coach.lastName}.`,
                });

                const eventData = {
                    type: "COACH_UPDATE",
                    payload: {
                        refetch: true,
                        message: `${sessionUser.firstName} ${sessionUser.lastName} updated coach: ${coach.firstName} ${coach.lastName}`,
                        roles: ["admin", "hr"],
                        receivers: [sessionUser._id.toString(), coach._id.toString()],
                    },
                };

                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: "Coach updated successfully",
                };
            } catch (error: any) {
                console.error(error);
                throw new Error("Failed to update coach");
            }
        },

        // reviewCoach: async (
        //     _: any,
        //     {
        //         _id,
        //         status,
        //         rejectionReason,
        //         price,
        //         currency = "USD"
        //     }: {
        //         _id: ObjectId;
        //         status: CoachStatus.VERIFIED | CoachStatus.REJECTED;
        //         rejectionReason?: string;
        //         price?: number;
        //         currency?: string;
        //     },
        //     ctx: IContext
        // ) => {
        //     if (!ctx?.session) throw new Error("Unauthenticated");
        //     const sessionUser = ctx.session.user;

        //     if (!["admin"].includes(sessionUser.role)) {
        //         throw new Error("Unauthorized to review coaches");
        //     }

        //     try {
        //         console.log("=== Starting coach review ===");
        //         console.log("Reviewing coach ID:", _id);
        //         console.log("Status:", status);
        //         console.log("Price:", price);
        //         console.log("Currency:", currency);

        //         const coach = await coachService.reviewCoach(
        //             _id,
        //             status,
        //             rejectionReason,
        //             sessionUser._id as unknown as ObjectId,
        //             price,
        //             currency
        //         );

        //         if (!coach) throw new Error("Failed to review coach");

        //         console.log("Coach updated successfully:", coach.email);

        //         if (status === CoachStatus.VERIFIED) {
        //             try {
        //                 console.log("Checking if user exists with email:", coach.email);
        //                 let user = await User.findOne({ email: coach.email });

        //                 if (!user) {
        //                     console.log("No existing user found, creating new user account");

        //                     const username = coach.email.split('@')[0];

        //                     const cleanLastName = coach.lastName.replace(/\s+/g, '');
        //                     const cleanFideId = coach.fideId ? coach.fideId.replace(/\s+/g, '') : '';

        //                     let rawPassword = `coach${cleanLastName}`;
        //                     if (cleanFideId) {
        //                         rawPassword += cleanFideId;
        //                     }

        //                     console.log("Generated raw password:", rawPassword);

        //                     const hashedPassword = await bcrypt.hash(rawPassword, 10);

        //                     user = await User.create({
        //                         firstName: coach.firstName,
        //                         lastName: coach.lastName,
        //                         username: username,
        //                         email: coach.email,
        //                         password: hashedPassword,
        //                         role: 'coach',
        //                         coachId: coach._id,
        //                         status: true,
        //                         isActive: true,
        //                     });

        //                     console.log("User created successfully with ID:", user._id);

        //                     console.log("Attempting to send welcome email...");
        //                     try {
        //                         const emailResult = await transporter.sendMail({
        //                             from: `"We Chess" <${process.env.SMTP_USER}>`,
        //                             to: coach.email,
        //                             subject: "🎉 Your Coach Account Has Been Created!",
        //                             html: await render(
        //                                 createElement(CoachAccountCreatedEmail, {
        //                                     firstName: coach.firstName,
        //                                     lastName: coach.lastName,
        //                                     email: coach.email,
        //                                     username: username,
        //                                     password: rawPassword,
        //                                     loginUrl: `${process.env.NEXTAUTH_URL}/login`,
        //                                 })
        //                             ),
        //                         })
        //                         console.log("Welcome email sent successfully:", emailResult.messageId);
        //                     } catch (emailError) {
        //                         console.error("Failed to send welcome email:", emailError);
        //                     }
        //                 } else {
        //                     console.log("User already exists with ID:", user._id);
        //                     console.log("Current user role:", user.role);
        //                     console.log("Current user coachId:", user.coachId);

        //                     user.coachId = coach._id;
        //                     user.role = 'coach';
        //                     await user.save();

        //                     console.log("Existing user updated successfully");

        //                     // Send notification
        //                     try {
        //                         await transporter.sendMail({
        //                             from: `"We Chess" <${process.env.SMTP_USER}>`,
        //                             to: coach.email,
        //                             subject: "🎉 You're Now a Verified Coach on We Chess!",
        //                             html: `
        //                         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        //                             <h1 style="color: #333;">Congratulations, ${coach.firstName}!</h1>
        //                             <p>Your coach application has been approved! Your existing account has been upgraded to a coach account.</p>
        //                             <p>You can now log in with your existing credentials to access your coach dashboard.</p>
        //                             <a href="${process.env.NEXTAUTH_URL}/coach/login" 
        //                                style="background-color: #4F46E5; color: white; padding: 12px 24px; 
        //                                       text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
        //                                 Go to Coach Dashboard
        //                             </a>
        //                         </div>
        //                     `,
        //                         });
        //                         console.log("Upgrade notification email sent");
        //                     } catch (emailError) {
        //                         console.error("Failed to send upgrade email:", emailError);
        //                     }
        //                 }
        //             } catch (userError) {
        //                 console.error("!!! ERROR creating/linking user account:", userError);
        //                 // Log the full error details
        //                 if (userError instanceof Error) {
        //                     console.error("Error name:", userError.name);
        //                     console.error("Error message:", userError.message);
        //                     console.error("Error stack:", userError.stack);
        //                 }
        //                 // Don't throw - coach verification still succeeded
        //             }
        //         }

        //         // Send verification/rejection emails
        //         try {
        //             if (status === CoachStatus.VERIFIED && price) {
        //                 console.log("Sending verification email to:", coach.email);
        //                 await transporter.sendMail({
        //                     from: `"We Chess" <${process.env.SMTP_USER}>`,
        //                     to: coach.email,
        //                     subject: "🎉 Your Coach Application Has Been Approved!",
        //                     html: await render(
        //                         createElement(VerifiedCoachEmail, {
        //                             name: `${coach.firstName} ${coach.lastName}`,
        //                             price: price,
        //                             currency: currency,
        //                         })
        //                     ),
        //                 });
        //                 console.log(`Verification email sent to ${coach.email}`);
        //             } else if (status === CoachStatus.REJECTED && rejectionReason) {
        //                 console.log("Sending rejection email to:", coach.email);
        //                 await transporter.sendMail({
        //                     from: `"We Chess" <${process.env.SMTP_USER}>`,
        //                     to: coach.email,
        //                     subject: "Update on Your Coach Application",
        //                     html: await render(
        //                         createElement(RejectedCoachEmail, {
        //                             name: `${coach.firstName} ${coach.lastName}`,
        //                             rejectionReason: rejectionReason,
        //                         })
        //                     ),
        //                 });
        //                 console.log(`Rejection email sent to ${coach.email}`);
        //             }
        //         } catch (emailError) {
        //             console.error("Failed to send review email to coach:", emailError);
        //         }

        //         await Log.create({
        //             user: sessionUser._id as unknown as ObjectId,
        //             action: `Coach application ${status}: ${coach.firstName} ${coach.lastName}${rejectionReason ? ` - Reason: ${rejectionReason}` : ''}${price ? ` - Rate: ${currency} ${price}` : ''}`,
        //         });

        //         const eventData = {
        //             type: "COACH_REVIEW",
        //             payload: {
        //                 refetch: true,
        //                 message: `${sessionUser.firstName} ${sessionUser.lastName} ${status === CoachStatus.VERIFIED ? 'verified' : 'rejected'} coach: ${coach.firstName} ${coach.lastName}${price ? ` (${currency} ${price}/hr)` : ''}`,
        //                 roles: ["admin", "hr"],
        //                 receivers: [
        //                     sessionUser._id.toString(),
        //                     coach._id.toString()
        //                 ],
        //             },
        //         };

        //         sseStore.broadcast(eventData);

        //         console.log("=== Coach review completed successfully ===");

        //         return {
        //             ok: true,
        //             message: status === CoachStatus.VERIFIED
        //                 ? `Coach verified successfully with rate ${currency} ${price}/hr. Login credentials sent to ${coach.email}`
        //                 : "Coach application rejected successfully",
        //         };
        //     } catch (error: any) {
        //         console.error("!!! ERROR in reviewCoach:", error);
        //         throw new Error(error.message || "Failed to review coach");
        //     }
        // },
        reviewCoach: async (
            _: any,
            {
                _id,
                status,
                rejectionReason,
                price,
                currency = "USD"
            }: {
                _id: ObjectId;
                status: CoachStatus.VERIFIED | CoachStatus.REJECTED;
                rejectionReason?: string;
                price?: number;
                currency?: string;
            },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            const sessionUser = ctx.session.user;

            if (!["admin"].includes(sessionUser.role)) {
                throw new Error("Unauthorized to review coaches");
            }

            try {
                console.log("=== Starting coach review ===");
                console.log("Reviewing coach ID:", _id);
                console.log("Status:", status);
                console.log("Price:", price);
                console.log("Currency:", currency);

                const coach = await coachService.reviewCoach(
                    _id,
                    status,
                    rejectionReason,
                    sessionUser._id as unknown as ObjectId,
                    price,
                    currency
                );

                if (!coach) throw new Error("Failed to review coach");

                console.log("Coach updated successfully:", coach.email);

                if (status === CoachStatus.VERIFIED) {
                    try {
                        console.log("Checking if user exists with email:", coach.email);
                        let user = await User.findOne({ email: coach.email });

                        if (!user) {
                            console.log("No existing user found, creating new user account");

                            const username = coach.email.split('@')[0];

                            const cleanLastName = coach.lastName.replace(/\s+/g, '');
                            const cleanFideId = coach.fideId ? coach.fideId.replace(/\s+/g, '') : '';

                            let rawPassword = `coach${cleanLastName}`;
                            if (cleanFideId) {
                                rawPassword += cleanFideId;
                            }

                            console.log("Generated raw password:", rawPassword);

                            const hashedPassword = await bcrypt.hash(rawPassword, 10);

                            user = await User.create({
                                firstName: coach.firstName,
                                lastName: coach.lastName,
                                username: username,
                                email: coach.email,
                                password: hashedPassword,
                                role: 'coach',
                                coachId: coach._id,
                                status: true,
                                isActive: true,
                            });

                            console.log("User created successfully with ID:", user._id);

                            console.log("Attempting to send welcome email...");
                            try {
                                const emailResult = await transporter.sendMail({
                                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                                    to: coach.email,
                                    subject: "🎉 Your Coach Account Has Been Created!",
                                    html: await render(
                                        createElement(CoachAccountCreatedEmail, {
                                            firstName: coach.firstName,
                                            lastName: coach.lastName,
                                            email: coach.email,
                                            username: username,
                                            password: rawPassword,
                                            loginUrl: `${process.env.NEXTAUTH_URL}/login`,
                                        })
                                    ),
                                })
                                console.log("Welcome email sent successfully:", emailResult.messageId);
                            } catch (emailError) {
                                console.error("Failed to send welcome email:", emailError);
                            }
                        } else {
                            console.log("User already exists with ID:", user._id);
                            console.log("Current user role:", user.role);
                            console.log("Current user coachId:", user.coachId);

                            user.coachId = coach._id;
                            user.role = 'coach';
                            await user.save();

                            console.log("Existing user updated successfully");

                            // Send notification
                            try {
                                await transporter.sendMail({
                                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                                    to: coach.email,
                                    subject: "🎉 You're Now a Verified Coach on We Chess!",
                                    html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                    <h1 style="color: #333;">Congratulations, ${coach.firstName}!</h1>
                                    <p>Your coach application has been approved! Your existing account has been upgraded to a coach account.</p>
                                    <p>You can now log in with your existing credentials to access your coach dashboard.</p>
                                    <a href="${process.env.NEXTAUTH_URL}/coach/login" 
                                       style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                                              text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
                                        Go to Coach Dashboard
                                    </a>
                                </div>
                            `,
                                });
                                console.log("Upgrade notification email sent");
                            } catch (emailError) {
                                console.error("Failed to send upgrade email:", emailError);
                            }
                        }
                    } catch (userError) {
                        console.error("!!! ERROR creating/linking user account:", userError);
                        // Log the full error details
                        if (userError instanceof Error) {
                            console.error("Error name:", userError.name);
                            console.error("Error message:", userError.message);
                            console.error("Error stack:", userError.stack);
                        }
                        // Don't throw - coach verification still succeeded
                    }
                }

                // ==========================
                // SEND EMAILS TO COACH AND ADMIN ASYNCHRONOUSLY
                // ==========================
                // Use Promise.allSettled to send all emails in parallel without blocking
                Promise.allSettled([
                    // Send email to coach
                    (async () => {
                        try {
                            if (status === CoachStatus.VERIFIED && price) {
                                console.log("Sending verification email to:", coach.email);
                                await transporter.sendMail({
                                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                                    to: coach.email,
                                    subject: "🎉 Your Coach Application Has Been Approved!",
                                    html: await render(
                                        createElement(VerifiedCoachEmail, {
                                            name: `${coach.firstName} ${coach.lastName}`,
                                            price: price,
                                            currency: currency,
                                        })
                                    ),
                                });
                                console.log(`Verification email sent to ${coach.email}`);
                            } else if (status === CoachStatus.REJECTED && rejectionReason) {
                                console.log("Sending rejection email to:", coach.email);
                                await transporter.sendMail({
                                    from: `"We Chess" <${process.env.SMTP_USER}>`,
                                    to: coach.email,
                                    subject: "Update on Your Coach Application",
                                    html: await render(
                                        createElement(RejectedCoachEmail, {
                                            name: `${coach.firstName} ${coach.lastName}`,
                                            rejectionReason: rejectionReason,
                                        })
                                    ),
                                });
                                console.log(`Rejection email sent to ${coach.email}`);
                            }
                        } catch (emailError) {
                            console.error("Failed to send review email to coach:", emailError);
                        }
                    })(),

                    // Send email to admin (info@we-chess.com)
                    (async () => {
                        try {
                            const adminEmailHtml = status === CoachStatus.VERIFIED
                                ? await render(
                                    createElement(AdminCoachVerifiedEmail, {
                                        coachName: `${coach.firstName} ${coach.lastName}`,
                                        coachEmail: coach.email,
                                        coachPhone: coach.phoneNumber,
                                        reviewedBy: `${sessionUser.firstName} ${sessionUser.lastName}`,
                                        price: price,
                                        currency: currency,
                                        chessTitle: coach.chessTitle,
                                        fideId: coach.fideId,
                                    })
                                )
                                : await render(
                                    createElement(AdminCoachRejectedEmail, {
                                        coachName: `${coach.firstName} ${coach.lastName}`,
                                        coachEmail: coach.email,
                                        reviewedBy: `${sessionUser.firstName} ${sessionUser.lastName}`,
                                        rejectionReason: rejectionReason || "No reason provided",
                                    })
                                );

                            const subject = status === CoachStatus.VERIFIED
                                ? `✅ Coach Verified: ${coach.firstName} ${coach.lastName}`
                                : `❌ Coach Rejected: ${coach.firstName} ${coach.lastName}`;

                            await transporter.sendMail({
                                from: `"We Chess" <${process.env.SMTP_USER}>`,
                                to: 'info@we-chess.com',
                                subject: subject,
                                html: adminEmailHtml,
                            });
                            console.log(`Admin notification email sent for coach ${status}`);
                        } catch (adminEmailError) {
                            console.error("Failed to send admin notification email:", adminEmailError);
                        }
                    })()
                ]).then(results => {
                    console.log("Email sending completed:", results);
                });

                await Log.create({
                    user: sessionUser._id as unknown as ObjectId,
                    action: `Coach application ${status}: ${coach.firstName} ${coach.lastName}${rejectionReason ? ` - Reason: ${rejectionReason}` : ''}${price ? ` - Rate: ${currency} ${price}` : ''}`,
                });

                const eventData = {
                    type: "COACH_REVIEW",
                    payload: {
                        refetch: true,
                        message: `${sessionUser.firstName} ${sessionUser.lastName} ${status === CoachStatus.VERIFIED ? 'verified' : 'rejected'} coach: ${coach.firstName} ${coach.lastName}${price ? ` (${currency} ${price}/hr)` : ''}`,
                        roles: ["admin", "hr"],
                        receivers: [
                            sessionUser._id.toString(),
                            coach._id.toString()
                        ],
                    },
                };

                sseStore.broadcast(eventData);

                console.log("=== Coach review completed successfully ===");

                return {
                    ok: true,
                    message: status === CoachStatus.VERIFIED
                        ? `Coach verified successfully with rate ${currency} ${price}/hr. Login credentials sent to ${coach.email}`
                        : "Coach application rejected successfully",
                };
            } catch (error: any) {
                console.error("!!! ERROR in reviewCoach:", error);
                throw new Error(error.message || "Failed to review coach");
            }
        },

        changeCoachStatus: async (
            _: any,
            { _id, status, rejectionReason }: { _id: ObjectId; status: CoachStatus.VERIFIED | CoachStatus.REJECTED; rejectionReason?: string },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            const sessionUser = ctx.session.user;

            // Only allow admin/hr to change status
            if (!["admin", "hr"].includes(sessionUser.role)) {
                throw new Error("Unauthorized to change coach status");
            }

            try {
                const coach = await coachService.changeCoachStatus(
                    _id,
                    status,
                    rejectionReason,
                    sessionUser._id as unknown as ObjectId
                );

                if (!coach) throw new Error("Failed to change coach status");

                await Log.create({
                    user: sessionUser._id as unknown as ObjectId,
                    action: `Coach status changed from ${coach.status} to ${status}: ${coach.firstName} ${coach.lastName}${status === CoachStatus.REJECTED && rejectionReason ? ` - Reason: ${rejectionReason}` : ''
                        }`,
                });

                const eventData = {
                    type: "COACH_STATUS_CHANGE",
                    payload: {
                        refetch: true,
                        message: `${sessionUser.firstName} ${sessionUser.lastName} changed coach status to ${status} for ${coach.firstName} ${coach.lastName}`,
                        roles: ["admin", "hr"],
                        receivers: [sessionUser._id.toString(), coach._id.toString()],
                    },
                };

                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: `Coach status changed to ${status} successfully`,
                };
            } catch (error: any) {
                console.error(error);
                throw new Error(error.message || "Failed to change coach status");
            }
        },

        deleteCoach: async (_: any, { _id }: { _id: string }, ctx: IContext) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            const sessionUser = ctx.session.user;

            try {
                const coach = await coachService.deleteCoach(_id as unknown as ObjectId);
                if (!coach) throw new Error("Failed to delete coach");

                await Log.create({
                    user: sessionUser._id as unknown as ObjectId,
                    action: `Coach deleted: ${coach.firstName} ${coach.lastName}.`,
                });

                const eventData = {
                    type: "COACH_DELETE",
                    payload: {
                        refetch: true,
                        message: `${sessionUser.firstName} ${sessionUser.lastName} deleted coach: ${coach.firstName} ${coach.lastName}`,
                        roles: ["admin", "hr"],
                        receivers: [sessionUser._id.toString()],
                    },
                };

                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: "Coach deleted successfully",
                };
            } catch (error: any) {
                console.error(error);
                throw new Error("Failed to delete coach");
            }
        },

        deleteMultipleCoaches: async (
            _: any,
            { ids }: { ids: ObjectId[] },
            ctx: IContext
        ) => {
            if (!ctx?.session) throw new Error("Unauthenticated");
            const user = ctx.session.user;

            try {
                const deletedCount = await coachService.deleteMultipleCoaches(ids);

                if (deletedCount === 0) {
                    throw new Error("No coaches were deleted");
                }

                await Log.create({
                    user: user._id as unknown as ObjectId,
                    action: `Deleted ${deletedCount} coaches in batch`,
                });

                const eventData = {
                    type: "COACH_DELETE",
                    payload: {
                        refetch: true,
                        message: `${user.firstName} ${user.lastName} deleted ${deletedCount} coaches`,
                        roles: ["admin", "hr"],
                        receivers: [user._id.toString()],
                    },
                };

                sseStore.broadcast(eventData);

                return {
                    ok: true,
                    message: `Successfully deleted ${deletedCount} coach${deletedCount > 1 ? "es" : ""}`,
                };
            } catch (error: any) {
                console.error(error);
                throw new Error("Failed to delete coaches");
            }
        },
    },
};

export default coachResolvers;