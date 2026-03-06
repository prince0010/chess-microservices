// modules/coach/services.ts
import Coach from "@/models/Coach";
import { ObjectId } from "mongoose";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { ICoachInput, ChessTitle, CoachStatus } from "./interface";

// Helper function to get chess title label
const getChessTitleLabel = (chessTitle: ChessTitle): string => {
    const titleMap: Record<ChessTitle, string> = {
        [ChessTitle.NONE]: "",
        [ChessTitle.WORLD_CHAMPION]: "World Champion",
        [ChessTitle.GRANDMASTER]: "GM",
        [ChessTitle.WOMAN_GRANDMASTER]: "WGM",
        [ChessTitle.INTERNATIONAL_MASTER]: "IM",
        [ChessTitle.WOMAN_INTERNATIONAL_MASTER]: "WIM",
        [ChessTitle.FIDE_MASTER]: "FM",
        [ChessTitle.WOMAN_FIDE_MASTER]: "WFM",
        [ChessTitle.CANDIDATE_MASTER]: "CM",
        [ChessTitle.WOMAN_CANDIDATE_MASTER]: "WCM",
        [ChessTitle.ARENA_GRANDMASTER]: "AGM",
        [ChessTitle.WOMAN_ARENA_GRANDMASTER]: "WAGM",
        [ChessTitle.ARENA_INTERNATIONAL_MASTER]: "AIM",
        [ChessTitle.WOMAN_ARENA_INTERNATIONAL_MASTER]: "WAIM",
        [ChessTitle.ARENA_FIDE_MASTER]: "AFM",
        [ChessTitle.WOMAN_ARENA_FIDE_MASTER]: "WAFM",
    };
    return titleMap[chessTitle] || "";
};

// Fetch Coach By ID
const fetchCoachById = async (id: string) => {
    const coach = await Coach.findOne({ _id: id });
    if (!coach) throw new Error("Coach not found");
    return coach;
};

// ADD THIS NEW FUNCTION - Fetch Coach By Email
const fetchCoachByEmail = async (email: string) => {
    console.log("Service - Fetching coach by email:", email);
    const coach = await Coach.findOne({ email });
    if (!coach) throw new Error("Coach not found");
    return coach;
};

// Fetch All Coaches
const fetchAllCoaches = async () => Coach.find().sort({ applicationDate: -1 });

// Fetch Coach Options - Only verified coaches for public listings
const fetchCoachOptions = async () => {
    const coaches = await Coach.find({
        status: CoachStatus.VERIFIED,
        isActive: true
    }).sort({ firstName: 1, lastName: 1 });

    return coaches.map((coach) => ({
        label: `${coach.firstName} ${coach.lastName}${coach.fideId ? ` (FIDE: ${coach.fideId})` : ''
            }${coach.chessTitle && coach.chessTitle !== ChessTitle.NONE
                ? ` [${getChessTitleLabel(coach.chessTitle)}]`
                : ''
            }${coach.price ? ` - ₱${coach.price}/hr` : ''}`,
        value: coach._id.toString(),
    }));
};

// Fetch Coach Datatable Data
const fetchCoachTable = async ({
    first = 10,
    after,
    search,
    filter,
    sort = { key: "applicationDate", order: "DESC" },
}: {
    first?: number;
    after?: string;
    search?: string;
    filter?: Array<{ key: string; term: string; type: "TEXT" | "SELECT" | "DATE" }>;
    sort?: {
        key: string;
        order: "ASC" | "DESC";
    };
}) => {
    console.log("==== FETCH COACH TABLE SERVICE ====");
    console.log("Filter received:", JSON.stringify(filter, null, 2));

    const matchStage: Record<string, any> = {};

    if (search) {
        matchStage.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { fideId: { $regex: search, $options: "i" } },
            { languages: { $regex: search, $options: "i" } },
            {
                $expr: {
                    $regexMatch: {
                        input: { $concat: ["$firstName", " ", "$lastName"] },
                        regex: search,
                        options: "i",
                    },
                },
            },
        ];
    }

    // Handle column filtering
    if (filter && filter.length > 0) {
        console.log("Processing filters...");
        matchStage.$and = filter.map(({ key, term, type }) => {
            console.log(`Filter item - key: ${key}, term: ${term}, type: ${type}`);

            switch (type) {
                case "TEXT":
                    if (key === "fullName") {
                        return {
                            $or: [
                                { firstName: { $regex: term, $options: "i" } },
                                { lastName: { $regex: term, $options: "i" } },
                                {
                                    $expr: {
                                        $regexMatch: {
                                            input: { $concat: ["$firstName", " ", "$lastName"] },
                                            regex: term,
                                            options: "i",
                                        },
                                    },
                                },
                            ],
                        };
                    }
                    return { [key]: { $regex: term, $options: "i" } };
                case "DATE":
                    const dates = term.split("_");
                    if (dates.length !== 2) throw new Error("Invalid date range format");
                    const from = startOfDay(parseISO(dates[0]));
                    const to = endOfDay(parseISO(dates[1]));
                    return { [key]: { $gte: from, $lte: to } };
                case "SELECT":
                    if (key === "status") {
                        console.log(`Creating status filter for term: "${term}"`);
                        return { [key]: term };
                    }
                    if (key === "wantsToBeListed" || key === "hasStudentsOnApp" || key === "isActive") {
                        return {
                            [key]: term === "true" ? true : term === "false" ? false : term,
                        };
                    }
                    return { [key]: term };
                default:
                    return { [key]: term };
            }
        });
    }

    console.log("Match stage:", JSON.stringify(matchStage, null, 2));

    // Handle Pagination
    if (after) {
        const doc = await Coach.findById(after);
        if (doc && sort.key) {
            matchStage[sort.key] = {
                [sort.order === "ASC" ? "$gt" : "$lt"]:
                    doc[sort.key as keyof typeof doc],
            };
        }
    }

    const coaches = await Coach.aggregate([
        { $match: matchStage },
        { $sort: { [sort.key]: sort.order === "ASC" ? 1 : -1 } },
        { $limit: first + 1 },
        {
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                email: 1,
                cvFile: 1,
                fideId: 1,
                chessTitle: 1,
                photo: 1,
                hasStudentsOnApp: 1,
                wantsToBeListed: 1,
                languages: 1,
                status: 1,
                isActive: 1,
                applicationDate: 1,
                achievements: 1,
                reviewedBy: 1,
                reviewedAt: 1,
                rejectionReason: 1,
                price: 1,
                currency: 1,
            },
        },
    ]);

    console.log(`Found ${coaches.length} coaches matching criteria`);

    const edges = coaches
        .slice(0, first > 0 ? first : coaches.length)
        .map((coach) => ({
            node: coach,
            cursor: coach._id.toString(),
        }));

    const totalStage = { ...matchStage };
    if (totalStage[sort.key]) {
        delete totalStage[sort.key];
    }
    const total = await Coach.aggregate([
        { $match: totalStage },
        { $count: "count" },
    ]);
    const totalCount = total.length > 0 ? total[0].count : 0;

    return {
        edges,
        pageInfo: {
            total: totalCount,
            hasNextPage: coaches.length > first,
            endCursor: edges.length
                ? edges[edges.length - 1].node._id.toString()
                : null,
        },
    };
};

// Create Coach - Always sets status to PENDING
const createCoach = async (
    input: ICoachInput,
    photoUrl?: string,
    cvUrl?: string
) => {
    if (!cvUrl) throw new Error("CV file upload failed");

    const hasStudentsOnApp =
        input.hasStudentsOnApp === "yes" || input.hasStudentsOnApp === "true";
    const wantsToBeListed =
        input.wantsToBeListed === "yes" || input.wantsToBeListed === "true";

    const coachData = {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
        email: input.email,
        fideId: input.fideId,
        chessTitle: input.chessTitle || ChessTitle.NONE,
        hasStudentsOnApp,
        wantsToBeListed,
        languages: input.languages,
        photo: photoUrl,
        cvFile: cvUrl,
        status: CoachStatus.PENDING,
        isActive: true,
        applicationDate: new Date(),
        currency: "USD",
    };

    return await Coach.create(coachData);
};

// Update Coach - Prevents status updates
const updateCoach = async (id: ObjectId, input: any) => {
    const { status, reviewedBy, reviewedAt, rejectionReason, ...updateData } = input;
    return await Coach.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

// Review Coach - For admin review of pending applications with price
const reviewCoach = async (
    id: ObjectId,
    status: CoachStatus.VERIFIED | CoachStatus.REJECTED,
    rejectionReason?: string,
    reviewerId?: ObjectId,
    price?: number,
    currency: string = "USD"
) => {
    if (![CoachStatus.VERIFIED, CoachStatus.REJECTED].includes(status)) {
        throw new Error("Invalid review status. Must be verified or rejected.");
    }

    const coach = await Coach.findById(id);
    if (!coach) throw new Error("Coach not found");

    if (coach.status !== CoachStatus.PENDING) {
        throw new Error("Can only review coaches with pending status");
    }

    const updateData: any = {
        status,
        reviewedAt: new Date(),
        reviewedBy: reviewerId
    };

    if (status === CoachStatus.REJECTED && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
        // Clear price if rejected
        updateData.price = null;
    } else if (status === CoachStatus.VERIFIED) {
        updateData.rejectionReason = null;
        updateData.isActive = true;

        // NEW: Set price when verifying
        if (price !== undefined && price !== null) {
            if (price < 0) {
                throw new Error("Price cannot be negative");
            }
            updateData.price = price;
            updateData.currency = currency || "USD";
        } else {
            // If no price provided, set default or throw error
            throw new Error("Price is required when verifying a coach");
        }
    }

    return await Coach.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

const changeCoachStatus = async (
    id: ObjectId,
    status: CoachStatus.VERIFIED | CoachStatus.REJECTED,
    rejectionReason?: string,
    reviewerId?: ObjectId,
    price?: number,
    currency: string = "USD"
) => {
    if (![CoachStatus.VERIFIED, CoachStatus.REJECTED].includes(status)) {
        throw new Error("Invalid status. Must be verified or rejected.");
    }

    const coach = await Coach.findById(id);
    if (!coach) throw new Error("Coach not found");

    if (coach.status === CoachStatus.PENDING) {
        throw new Error("Please use reviewCoach to review pending applications");
    }

    const updateData: any = {
        status,
        reviewedAt: new Date(),
        reviewedBy: reviewerId
    };

    if (status === CoachStatus.REJECTED && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
        // Clear price when rejected
        updateData.price = null;
    } else if (status === CoachStatus.VERIFIED) {
        updateData.rejectionReason = null;
        updateData.isActive = true;

        // Update price if provided
        if (price !== undefined && price !== null) {
            if (price < 0) {
                throw new Error("Price cannot be negative");
            }
            updateData.price = price;
            updateData.currency = currency || "USD";
        }
    }

    return await Coach.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

// Delete Coach
const deleteCoach = async (id: ObjectId) => {
    const coach = await Coach.findByIdAndDelete(id);
    if (!coach) throw new Error("Coach not found");
    return coach;
};

// Delete Multiple Coaches
const deleteMultipleCoaches = async (ids: ObjectId[]) => {
    const result = await Coach.deleteMany({ _id: { $in: ids } });
    return result.deletedCount;
};

const coachService = {
    fetchCoachById,
    fetchCoachByEmail,
    fetchAllCoaches,
    fetchCoachOptions,
    fetchCoachTable,
    createCoach,
    updateCoach,
    reviewCoach,
    changeCoachStatus,
    deleteCoach,
    deleteMultipleCoaches,
    getChessTitleLabel,
};

export default coachService;