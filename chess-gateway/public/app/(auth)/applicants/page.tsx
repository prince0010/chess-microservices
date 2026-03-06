"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/table/data-table";
import {
    Users,
    UserX,
    Mail,
    Phone,
    FileCheck,
    Search,
    Eye,
    Shield,
    Clock,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSSE } from "@/components/layouts/sse";
// import { useSession } from "next-auth/react"; // Commented out - unused
// import { IUser } from "@/modules/user/interfaces"; // Commented out - unused
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    useFetchCoachTable,
    useReviewCoach,
    useDeleteCoach,
    useDeleteMultipleCoaches
} from "@/modules/coach/hooks";

import { ICoach as ICoachModule, CoachStatus, ChessTitle } from "@/modules/coach/interface";
import CoachViewDialog from "../dashboard/dialog/view";
import { CHESS_TITLE_OPTIONS } from "@/app/(public)/coach/page";
import CoachReviewPendingDialog from "./dialogs/review";
import CoachAchievementsDialog from "@/components/custom/achievement";

const StatusBadge = () => {
    return (
        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
        </Badge>
    );
};

const CoachesPage = () => {
    const [rows, setRows] = useState<number>(10);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [maxIndex, setMaxIndex] = useState<number>(0);

    // Global Search
    const [search, setSearch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    // Column Sorting - prefixed with underscore to indicate it's unused
    const [sort] = useState<{
        key: string;
        order: "ASC" | "DESC";
    }>({ key: "applicationDate", order: "DESC" });

    // Column Filtering - FORCE PENDING ONLY
    const [filter] = useState<
        { key: string; term: string; type: string }[]
    >([{ key: "status", term: CoachStatus.PENDING, type: "SELECT" }]);

    // Selected Rows
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // View Dialog State
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedCoachForView, setSelectedCoachForView] = useState<ICoachModule | null>(null);

    // Review Dialog State
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedCoachForReview, setSelectedCoachForReview] = useState<ICoachModule | null>(null);

    const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
    const [selectedCoachForAchievements, setSelectedCoachForAchievements] = useState<ICoachModule | null>(null);

    // SSE
    const { eventData, clearEventData } = useSSE();

    // Hooks - ALWAYS use the filter with pending status
    const {
        data: queryData,
        loading,
        fetchMore,
        refetch,
    } = useFetchCoachTable({
        first: rows,
        search,
        sort,
        filter,
    });

    const [reviewCoach] = useReviewCoach();
    const [deleteCoach] = useDeleteCoach();
    const [deleteMultipleCoaches] = useDeleteMultipleCoaches();

    // Process data - convert to ICoachModule and DOUBLE FILTER for pending
    const { nodes, pageInfo } = useMemo(() => {
        const edges = queryData?.fetchCoachTable?.edges ?? [];
        const nodes = edges
            .map((edge: any) => {
                const node = edge.node;
                return {
                    ...node,
                    _id: node._id.toString(),
                    applicationDate: new Date(node.applicationDate),
                    reviewedAt: node.reviewedAt ? new Date(node.reviewedAt) : undefined,
                    createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
                    updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
                } as ICoachModule;
            })
            .filter((node: any) => node.status === CoachStatus.PENDING);

        const pageInfo = queryData?.fetchCoachTable?.pageInfo;

        return {
            nodes,
            pageInfo,
        };
    }, [queryData]);

    // Current page data
    const currentPageData = useMemo(() => {
        const start = currentIndex * rows;
        const end = start + rows;
        return nodes.slice(start, end);
    }, [nodes, currentIndex, rows]);

    // Refresh table function
    const refreshTable = useCallback(() => {
        refetch();
    }, [refetch]);

    // Handle view coach - wrapped in useCallback
    const handleViewCoach = useCallback((coach: ICoachModule) => {
        setSelectedCoachForView(coach);
        setViewDialogOpen(true);
    }, []);

    // Handle review dialog - wrapped in useCallback
    const handleReviewDialog = useCallback((coach: ICoachModule) => {
        setSelectedCoachForReview(coach);
        setReviewDialogOpen(true);
    }, []);

    // Handle achievements dialog - wrapped in useCallback
    const handleAchievementsDialog = useCallback((coach: ICoachModule) => {
        setSelectedCoachForAchievements(coach);
        setAchievementsDialogOpen(true);
    }, []);

    // Handle delete coach - wrapped in useCallback for useMemo dependency
    const handleDeleteCoach = useCallback(async (coachId: string) => {
        const toastId = toast.loading("Deleting coach...");
        try {
            await deleteCoach({
                variables: { _id: coachId }
            });
            toast.success("Coach deleted successfully", { id: toastId });
            refreshTable();
        } catch {
            toast.error("Failed to delete coach", { id: toastId });
        }
    }, [deleteCoach, refreshTable]);

    // Handle review from dialog
    const handleReview = useCallback(async (
        status: CoachStatus.VERIFIED | CoachStatus.REJECTED,
        rejectionReason?: string,
        price?: number,
        currency?: string
    ) => {
        if (!selectedCoachForReview) return;

        const toastId = toast.loading(`Reviewing application...`);
        try {
            await reviewCoach({
                variables: {
                    _id: selectedCoachForReview._id.toString(),
                    status,
                    rejectionReason,
                    price,
                    currency
                }
            });

            toast.success(
                status === CoachStatus.VERIFIED
                    ? `Coach verified successfully with price ${currency}${price}/hour`
                    : "Coach application rejected",
                { id: toastId }
            );

            refreshTable();
            setReviewDialogOpen(false);
        } catch {
            toast.error("Failed to review coach", { id: toastId });
        }
    }, [reviewCoach, refreshTable, selectedCoachForReview]);

    // Actions Column Component - moved inside component but before useMemo
    const ActionsColumn = useMemo(() => {
        const Component = ({
            data,
        }: {
            data: ICoachModule;
        }) => {
            const [isLoading, setIsLoading] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

            const handleDelete = async () => {
                setIsLoading(true);
                try {
                    await handleDeleteCoach(data._id.toString());
                } finally {
                    setIsLoading(false);
                    setIsDeleteDialogOpen(false);
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Application Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => handleAchievementsDialog(data)}
                                className="text-purple-600 focus:text-purple-600"
                            >
                                <Award className="w-4 h-4 mr-2" />
                                Manage Achievements
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleViewCoach(data)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => handleReviewDialog(data)}
                                className="text-blue-600 focus:text-blue-600"
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Review Application
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => window.open(data.cvFile, '_blank')}
                                    className="text-blue-600 focus:text-blue-600"
                                >
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    View CV
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => window.location.href = `mailto:${data.email}`}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Email
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-red-600 focus:text-red-600"
                                disabled={isLoading}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                Delete Application
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Application</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete {data.firstName} {data.lastName}&apos;s application?
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                                    {isLoading ? "Deleting..." : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        };
        return Component;
    }, [handleDeleteCoach, handleViewCoach, handleReviewDialog, handleAchievementsDialog]);

    // Handle SSE events
    useEffect(() => {
        if (eventData) {
            const { type, payload } = eventData;

            if (type === "COACH_APPLICATION" && payload?.refetch) {
                toast.info("New coach application received!");
                refreshTable();
            }

            if (type === "COACH_REVIEW" && payload?.refetch) {
                toast.info(payload.message);
                refreshTable();
            }

            clearEventData();
        }
    }, [eventData, clearEventData, refreshTable]);

    // Statistics - Only PENDING
    const statistics = useMemo(() => {
        const totalApplicants = nodes.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newToday = nodes.filter((c: any) => {
            const appDate = new Date(c.applicationDate);
            appDate.setHours(0, 0, 0, 0);
            return appDate.getTime() === today.getTime();
        }).length;

        return {
            totalApplicants,
            newToday,
        };
    }, [nodes]);

    // Reset indexes
    const resetIndexes = () => {
        setCurrentIndex(0);
        setMaxIndex(0);
    };

    // On Search
    const onSearch = (value: string) => {
        setSearch(value);
        resetIndexes();
    };

    // Next Page
    const goNext = async () => {
        const totalPages = Math.ceil(nodes.length / rows);
        if (currentIndex >= totalPages - 1) return;

        if (currentIndex === maxIndex && pageInfo?.hasNextPage) {
            try {
                await fetchMore({
                    variables: {
                        first: rows,
                        after: pageInfo.endCursor,
                        search,
                        sort,
                        filter, // This maintains the pending filter
                    },
                    updateQuery: (prev: any, { fetchMoreResult: more }: any) => {
                        if (!more) return prev;
                        return {
                            fetchCoachTable: {
                                ...more.fetchCoachTable,
                                edges: [
                                    ...prev.fetchCoachTable.edges,
                                    ...more.fetchCoachTable.edges,
                                ],
                            },
                        };
                    },
                });
                setMaxIndex(prev => prev + 1);
            } catch {
                toast.error("Failed to load more data");
                return;
            }
        }

        setCurrentIndex(prev => prev + 1);
    };

    // Previous Page
    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Handle batch delete
    const handleBatchDelete = async () => {
        if (selectedIds.size === 0) {
            toast.error("Please select applications to delete.");
            return;
        }

        const toastId = toast.loading(`Deleting ${selectedIds.size} application(s)...`);

        try {
            await deleteMultipleCoaches({
                variables: { ids: Array.from(selectedIds) }
            });

            toast.success(`Deleted ${selectedIds.size} application(s) successfully`, { id: toastId });

            setSelectedIds(new Set());
            refreshTable();
            setDeleteDialogOpen(false);
        } catch {
            toast.error("Failed to delete applications. Please try again.", { id: toastId });
        }
    };

    // Table Columns
    const columns: ColumnDef<ICoachModule>[] = useMemo(
        () => [
            {
                id: "select",
                footer: () => {
                    return (
                        <Checkbox
                            checked={selectedIds.size === nodes.length && nodes.length > 0}
                            className="hover:cursor-pointer"
                            onCheckedChange={(value: boolean) => {
                                if (value) {
                                    const allIds = new Set<string>(
                                        nodes.map((coach: any) => coach._id.toString())
                                    );
                                    setSelectedIds(allIds);
                                } else {
                                    setSelectedIds(new Set());
                                }
                            }}
                        />
                    );
                },
                cell: ({ row }) => {
                    const isChecked = selectedIds.has(row.original._id.toString());
                    return (
                        <Checkbox
                            checked={isChecked}
                            className="hover:cursor-pointer"
                            onCheckedChange={(value: boolean) => {
                                setSelectedIds((prev) => {
                                    const newSet = new Set(prev);
                                    if (value) {
                                        newSet.add(row.original._id.toString());
                                    } else {
                                        newSet.delete(row.original._id.toString());
                                    }
                                    return newSet;
                                });
                            }}
                        />
                    );
                },
                size: 10,
            },
            {
                accessorKey: "photo",
                header: "Photo",
                cell: ({ row }) => {
                    const coach = row.original;
                    return (
                        <Avatar className="h-10 w-10">
                            {coach.photo ? (
                                <AvatarImage src={coach.photo} alt={`${coach.firstName} ${coach.lastName}`} />
                            ) : (
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                    {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    );
                },
                size: 80,
            },
            {
                accessorKey: "fullName",
                header: () => (
                    <div className="font-semibold">Applicant Name</div>
                ),
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.firstName} {row.original.lastName}</div>
                        {row.original.fideId && (
                            <div className="text-xs text-gray-500">FIDE ID: {row.original.fideId}</div>
                        )}
                        {row.original.chessTitle && row.original.chessTitle !== ChessTitle.NONE && (
                            <div className="text-xs text-blue-600 font-medium">
                                {CHESS_TITLE_OPTIONS.find((t) => t.value === row.original.chessTitle)?.label || row.original.chessTitle}
                            </div>
                        )}
                    </div>
                ),
                size: 180,
            },
            {
                accessorKey: "contact",
                header: "Contact",
                cell: ({ row }) => (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{row.original.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{row.original.phoneNumber}</span>
                        </div>
                    </div>
                ),
                size: 200,
            },
            {
                accessorKey: "languages",
                header: "Languages",
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.languages.slice(0, 2).map((lang, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {lang}
                            </Badge>
                        ))}
                        {row.original.languages.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{row.original.languages.length - 2}
                            </Badge>
                        )}
                    </div>
                ),
                size: 120,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: () => <StatusBadge />,
                size: 120,
            },
            {
                accessorKey: "applicationDate",
                header: () => (
                    <div className="font-semibold">Applied Date</div>
                ),
                cell: ({ row }) => (
                    <div className="text-sm">
                        {new Date(row.original.applicationDate).toLocaleDateString()}
                    </div>
                ),
                size: 120,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <ActionsColumn
                        data={row.original}
                    />
                ),
                size: 120,
            },
        ],
        [selectedIds, nodes, ActionsColumn]
    );

    const totalPages = Math.ceil(nodes.length / rows);

    return (
        <div className="w-full h-full flex-1 flex flex-col gap-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-900">
                        <Users className="size-6" />
                        <Label className="text-2xl font-semibold">Pending Applications</Label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Review and manage pending coach applications
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete Selected ({selectedIds.size})
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshTable()}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Applications</p>
                            <p className="text-3xl font-bold text-yellow-600">
                                {statistics.totalApplicants}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Applied Today</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {statistics.newToday}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Input
                                className="w-full md:w-[300px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                placeholder="Search applicants by name, email, or phone..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") onSearch(searchTerm);
                                    if (e.key === "Escape") {
                                        setSearchTerm("");
                                        onSearch("");
                                    }
                                }}
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onSearch("");
                                        setSearchTerm("");
                                    }}
                                    className="text-white cursor-pointer border border-black bg-black"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Info and Pagination */}
                <div className="p-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="px-1.5">
                            {loading ? (
                                <span className="text-sm text-muted-foreground">Loading...</span>
                            ) : nodes.length === 0 ? (
                                <span className="text-sm text-muted-foreground">No pending applications found.</span>
                            ) : (
                                <div className="space-x-0.5">
                                    <span className="text-sm text-muted-foreground">
                                        Showing {currentIndex * rows + 1}-
                                        {Math.min((currentIndex + 1) * rows, nodes.length)} of {nodes.length} pending application{nodes.length === 1 ? "" : "s"}
                                    </span>
                                    {selectedIds.size > 0 && (
                                        <span className="text-sm text-muted-foreground ml-2">
                                            ({selectedIds.size} selected)
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                                <span className="text-sm text-muted-foreground">Rows</span>
                                <Select
                                    onValueChange={(value) => {
                                        setRows(parseInt(value));
                                        setCurrentIndex(0);
                                        setMaxIndex(0);
                                    }}
                                    value={rows.toString()}
                                >
                                    <SelectTrigger className="border-0 p-0 h-auto w-20">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Row Count</SelectLabel>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 border rounded-md">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={currentIndex === 0}
                                    onClick={goPrev}
                                    className="disabled:bg-muted"
                                >
                                    Prev
                                </Button>
                                <span className="text-sm text-muted-foreground px-2">
                                    Page {currentIndex + 1} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    disabled={currentIndex >= totalPages - 1}
                                    onClick={goNext}
                                    size="sm"
                                    className="disabled:bg-muted"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <span className="text-sm text-muted-foreground">
                                Loading applications...
                            </span>
                        </div>
                    ) : nodes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg">
                            <Users className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No pending applications
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {search
                                    ? "Try adjusting your search"
                                    : "New applications will appear here"}
                            </p>
                            {search && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => {
                                        onSearch("");
                                        setSearchTerm("");
                                    }}
                                >
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <DataTable
                            loading={false}
                            columns={columns}
                            data={currentPageData}
                        />
                    )}
                </div>
            </div>

            {/* Batch Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Selected Applications</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedIds.size} selected application(s)?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleBatchDelete}>
                            Delete {selectedIds.size} Application(s)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CoachViewDialog
                isOpen={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                coach={selectedCoachForView}
            />

            <CoachReviewPendingDialog
                isOpen={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                coach={selectedCoachForReview}
                onReview={handleReview}
            />

            <CoachAchievementsDialog
                isOpen={achievementsDialogOpen}
                onClose={() => setAchievementsDialogOpen(false)}
                coach={selectedCoachForAchievements}
                onSuccess={refreshTable}
            />
        </div>
    );
};

export default CoachesPage;