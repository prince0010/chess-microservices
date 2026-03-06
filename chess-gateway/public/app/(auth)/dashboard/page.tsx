"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ColumnFilter from "@/components/table/column-filter";
import SortHeader from "@/components/table/sort-header";
import DataTable from "@/components/table/data-table";
import { cn } from "@/lib/utils";
import {
  Users,
  UserX,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Search,
  Filter,
  Eye,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  UserCog,
  Award,
  ChevronUp,
  ChevronDown,
  RefreshCcw
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
// import { useSession } from "next-auth/react";
// import { IUser } from "@/modules/user/interfaces";
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
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useFetchCoachTable,
  useReviewCoach,
  useChangeCoachStatus,
  useDeleteCoach,
  useDeleteMultipleCoaches
} from "@/modules/coach/hooks";

import { ICoach as ICoachModule, CoachStatus, ChessTitle } from "@/modules/coach/interface";
import CoachViewDialog from "../dashboard/dialog/view";

import CoachStatusDialog from "../dashboard/dialog/status";
import { CHESS_TITLE_OPTIONS } from "@/app/(public)/coach/page";
import CoachAchievementsDialog from "@/components/custom/achievement";
import CoachReviewPendingDialog from "./dialog/review";

// Status Badge Component
const StatusBadge = ({ status }: { status: CoachStatus }) => {
  const getStatusConfig = (status: CoachStatus) => {
    switch (status) {
      case CoachStatus.PENDING:
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case CoachStatus.VERIFIED:
        return {
          label: "Verified",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      case CoachStatus.REJECTED:
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1 px-3 py-1", config.className)}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

const CoachesManagementPage = () => {
  // Page States
  const [rows, setRows] = useState<number>(10);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  // Global Search
  const [search, setSearch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Column Sorting
  const [sort, setSort] = useState<{
    key: string;
    order: "ASC" | "DESC";
  }>({ key: "applicationDate", order: "DESC" });

  // Column Filtering
  const [filter, setFilter] = useState<
    { key: string; term: string; type: string }[]
  >([]);

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

  // Status Dialog State (for verified/rejected toggling)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedCoachForStatus, setSelectedCoachForStatus] = useState<ICoachModule | null>(null);
  // Achievements Dialog State
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
  const [selectedCoachForAchievements, setSelectedCoachForAchievements] = useState<ICoachModule | null>(null);

  const [showStatistics, setShowStatistics] = useState<boolean>(true)

  // Add state for overall statistics that will remain constant
  const [overallStats, setOverallStats] = useState({
    totalCoaches: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    listed: 0,
    pendingPercentage: 0,
    verifiedPercentage: 0
  });

  // SSE and Session
  const { eventData, clearEventData } = useSSE();
  // const { data: session } = useSession();
  // const user = session?.user as IUser; // Commented out - unused

  // Hooks - for filtered table data
  const {
    data: queryData,
    loading,
    fetchMore,
    refetch,
  } = useFetchCoachTable({
    first: rows,
    search,
    sort,
    filter: filter.map(f => ({
      key: f.key,
      term: f.term,
      type: f.type
    })),
  });

  // Separate query for overall stats (unfiltered)
  const {
    data: overallData,
    refetch: refetchOverall
  } = useFetchCoachTable({
    first: 1000, // Fetch a large number to get all coaches
    search: "",
    sort: { key: "applicationDate", order: "DESC" },
    filter: [] // No filters for overall stats
  });

  const [reviewCoach] = useReviewCoach();
  const [changeCoachStatus] = useChangeCoachStatus();
  const [deleteCoach] = useDeleteCoach();
  const [deleteMultipleCoaches] = useDeleteMultipleCoaches();

  const handleAchievementsDialog = useCallback((coach: ICoachModule) => {
    setSelectedCoachForAchievements(coach);
    setAchievementsDialogOpen(true);
  }, []);

  // Process filtered nodes for table display
  const { nodes, pageInfo } = useMemo(() => {
    const edges = queryData?.fetchCoachTable?.edges ?? [];
    const nodes = edges.map((edge: any) => {
      const node = edge.node;
      return {
        ...node,
        _id: node._id.toString(),
        applicationDate: new Date(node.applicationDate),
        reviewedAt: node.reviewedAt ? new Date(node.reviewedAt) : undefined,
        createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
        updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
      } as ICoachModule;
    });

    const pageInfo = queryData?.fetchCoachTable?.pageInfo;

    return {
      nodes,
      pageInfo,
    };
  }, [queryData]);

  // Calculate overall statistics from unfiltered data
  useEffect(() => {
    const edges = overallData?.fetchCoachTable?.edges ?? [];
    const allNodes = edges.map((edge: any) => {
      const node = edge.node;
      return {
        ...node,
        _id: node._id.toString(),
        applicationDate: new Date(node.applicationDate),
        reviewedAt: node.reviewedAt ? new Date(node.reviewedAt) : undefined,
        createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
        updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
      } as ICoachModule;
    });

    const totalCoaches = allNodes.length;
    const pending = allNodes.filter((c: any) => c.status === CoachStatus.PENDING).length;
    const verified = allNodes.filter((c: any) => c.status === CoachStatus.VERIFIED).length;
    const rejected = allNodes.filter((c: any) => c.status === CoachStatus.REJECTED).length;
    const listed = allNodes.filter((c: any) => c.wantsToBeListed && c.status === CoachStatus.VERIFIED).length;

    setOverallStats({
      totalCoaches,
      pending,
      verified,
      rejected,
      listed,
      pendingPercentage: totalCoaches > 0 ? Math.round((pending / totalCoaches) * 100) : 0,
      verifiedPercentage: totalCoaches > 0 ? Math.round((verified / totalCoaches) * 100) : 0,
    });
  }, [overallData]);

  // Filter nodes based on active tab for table display only
  const filteredNodes = useMemo(() => {
    if (activeTab === "all") {
      return nodes;
    }

    // Map tab value to status
    const statusMap = {
      pending: CoachStatus.PENDING,
      verified: CoachStatus.VERIFIED,
      rejected: CoachStatus.REJECTED
    };

    const statusToFilter = statusMap[activeTab as keyof typeof statusMap];

    return nodes.filter((node: any) => node.status === statusToFilter);
  }, [nodes, activeTab]);

  // Current page data
  const currentPageData = useMemo(() => {
    const start = currentIndex * rows;
    const end = start + rows;
    return filteredNodes.slice(start, end);
  }, [filteredNodes, currentIndex, rows]);

  // Refresh table function - now refreshes both queries
  const refreshTable = useCallback(() => {
    refetch();
    refetchOverall(); // Also refresh overall stats
  }, [refetch, refetchOverall]);

  // Handle view coach
  const handleViewCoach = useCallback((coach: ICoachModule) => {
    setSelectedCoachForView(coach);
    setViewDialogOpen(true);
  }, []);

  // Handle review dialog
  const handleReviewDialog = useCallback((coach: ICoachModule) => {
    setSelectedCoachForReview(coach);
    setReviewDialogOpen(true);
  }, []);

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
  }, [selectedCoachForReview, reviewCoach, refreshTable])

  // Handle status change dialog (for toggling between verified/rejected)
  const handleStatusDialog = useCallback((coach: ICoachModule) => {
    setSelectedCoachForStatus(coach);
    setStatusDialogOpen(true);
  }, []);

  // Handle status change from dialog
  const handleStatusChange = useCallback(async (status: CoachStatus.VERIFIED | CoachStatus.REJECTED, rejectionReason?: string) => {
    if (!selectedCoachForStatus) return;

    const toastId = toast.loading(`Changing status to ${status}...`);
    try {
      await changeCoachStatus({
        variables: {
          _id: selectedCoachForStatus._id.toString(),
          status,
          rejectionReason
        }
      });

      toast.success(`Coach status changed to ${status}`, { id: toastId });
      refreshTable();
      setStatusDialogOpen(false);
    } catch {
      toast.error("Failed to change status", { id: toastId });
    }
  }, [selectedCoachForStatus, changeCoachStatus, refreshTable]);

  // Handle delete coach
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

  // Actions Column Component
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
              <Button variant="default" className="bg-gray-500 cursor-pointer p-2 text-xs border border-gray-300 hover:bg-gray-700" size="sm" disabled={isLoading}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Coach Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleAchievementsDialog(data)}
                className="text-orange-600 focus:text-orange-600"
              >
                <Award className="w-4 h-4 mr-2" />
                Manage Achievements
              </DropdownMenuItem>


              <DropdownMenuItem onClick={() => handleViewCoach(data)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {data.status === CoachStatus.PENDING ? (
                <DropdownMenuItem
                  onClick={() => handleReviewDialog(data)}
                  className="text-blue-600 focus:text-blue-600"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Review Application
                </DropdownMenuItem>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleStatusDialog(data)}
                    className="text-blue-600 focus:text-blue-600"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Change Status
                  </DropdownMenuItem>

                  {data.status === CoachStatus.VERIFIED ? (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(CoachStatus.REJECTED, "Status changed by admin")}
                      disabled={isLoading}
                      className="text-red-600 focus:text-red-600"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Coach
                    </DropdownMenuItem>
                  ) : data.status === CoachStatus.REJECTED ? (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(CoachStatus.VERIFIED)}
                      disabled={isLoading}
                      className="text-green-600 focus:text-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Coach
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
              )}

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
                Delete Coach
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Coach</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {data.firstName} {data.lastName}?
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
  }, [handleDeleteCoach, handleViewCoach, handleReviewDialog, handleStatusDialog, handleStatusChange, handleAchievementsDialog]);

  // Handle SSE events
  useEffect(() => {
    if (eventData) {
      const { type, payload } = eventData;

      if (type === "COACH_APPLICATION" && payload.refetch) {
        toast.info("New coach application received!");
        refreshTable();
      }

      if (type === "COACH_REVIEW" && payload.refetch) {
        toast.info(payload.message);
        refreshTable();
      }

      if (type === "COACH_STATUS_CHANGE" && payload.refetch) {
        toast.info(payload.message);
        refreshTable();
      }

      clearEventData();
    }
  }, [eventData, clearEventData, refreshTable]);

  useEffect(() => {
    setCurrentIndex(0);
    setMaxIndex(0);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "all") {
      const statusValue = activeTab === "pending" ? CoachStatus.PENDING :
        activeTab === "verified" ? CoachStatus.VERIFIED :
          CoachStatus.REJECTED;

      const hasStatus = filter.some(f => f.key === "status" && f.term === statusValue);

      if (!hasStatus) {
        const otherFilters = filter.filter(f => f.key !== "status");
        setFilter([...otherFilters, {
          key: "status",
          term: statusValue,
          type: "SELECT"
        }]);
      }
    } else {
      const hasStatusFilter = filter.some(f => f.key === "status");
      if (hasStatusFilter) {
        setFilter(prev => prev.filter(f => f.key !== "status"));
      }
    }
  }, [activeTab, filter])

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

  const onFilter = useCallback((value: any) => {
    if (!value) {
      setFilter([]);
    } else {
      if (Array.isArray(value)) {
        const transformedFilter = value.map((item: any) => ({
          key: item.key,
          term: item.term || item.value,
          value: item.value || item.term,
          type: item.type
        }));
        setFilter(transformedFilter);
      } else {
        setFilter([{
          key: value.key,
          term: value.term || value.value,
          type: value.type
        }]);
      }
    }
    resetIndexes();
  }, []);

  // On Sort
  const onSort = useCallback((value: any) => {
    if (!value) {
      setSort({ key: "applicationDate", order: "DESC" });
    } else {
      setSort(value);
    }
    resetIndexes();
  }, []);

  // Next Page
  const goNext = useCallback(async () => {
    const totalPages = Math.ceil(filteredNodes.length / rows);
    if (currentIndex >= totalPages - 1) return;

    if (currentIndex === maxIndex && pageInfo?.hasNextPage) {
      try {
        await fetchMore({
          variables: {
            first: rows,
            after: pageInfo.endCursor,
            search,
            sort,
            filter: filter.map(f => ({
              key: f.key,
              term: f.term,
              type: f.type
            })),
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
  }, [currentIndex, maxIndex, pageInfo, rows, filteredNodes.length, search, sort, filter, fetchMore]);

  // Previous Page
  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Handle batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select coaches to delete.");
      return;
    }

    const toastId = toast.loading(`Deleting ${selectedIds.size} coach(es)...`);

    try {
      await deleteMultipleCoaches({
        variables: { ids: Array.from(selectedIds) }
      });

      toast.success(`Deleted ${selectedIds.size} coach(es) successfully`, { id: toastId });

      setSelectedIds(new Set());
      refreshTable();
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete coaches. Please try again.", { id: toastId });
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
          <SortHeader
            label="Full Name"
            sortKey="lastName"
            sortState={sort}
            onSortChange={onSort}
          />
        ),
        footer: () => (
          <ColumnFilter
            label="Full Name"
            filterKey="lastName"
            filterType="TEXT"
            filterValue={filter}
            onFilterChange={onFilter}
          />
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
        header: () => (
          <SortHeader
            label="Status"
            sortKey="status"
            sortState={sort}
            onSortChange={onSort}
          />
        ),
        footer: () => (
          <ColumnFilter
            label="Status"
            filterKey="status"
            filterType="SELECT"
            filterValue={filter}
            onFilterChange={onFilter}
            options={[
              { label: "Pending", value: CoachStatus.PENDING },
              { label: "Verified", value: CoachStatus.VERIFIED },
              { label: "Rejected", value: CoachStatus.REJECTED },
            ]}
          />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 120,
      },
      {
        accessorKey: "applicationDate",
        header: () => (
          <SortHeader
            label="Applied Date"
            sortKey="applicationDate"
            sortState={sort}
            onSortChange={onSort}
          />
        ),
        footer: () => (
          <ColumnFilter
            label="Applied Date"
            filterKey="applicationDate"
            filterType="DATE"
            filterValue={filter}
            onFilterChange={onFilter}
          />
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            {new Date(row.original.applicationDate).toLocaleDateString()}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "reviewedAt",
        header: "Reviewed Date",
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.reviewedAt
              ? new Date(row.original.reviewedAt).toLocaleDateString()
              : "-"}
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
    [sort, filter, selectedIds, nodes, onSort, onFilter, ActionsColumn]
  );

  const totalPages = Math.ceil(filteredNodes.length / rows);

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-3 sm:gap-4 p-2 sm:p-4">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            <Label className="text-lg sm:text-xl lg:text-2xl font-semibold">Coaches</Label>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Review and manage coaches
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Delete Selected </span>
              ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshTable()}
            className="text-xs sm:text-sm cursor-pointer hover:bg-gray-200"
          >
            <RefreshCcw className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatistics(!showStatistics)}
            className="text-xs sm:text-sm flex items-center gap-1 cursor-pointer hover:bg-gray-200"
          >
            {showStatistics ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="hidden sm:inline text-[12px]" >Hide Stats</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="hidden sm:inline text-[12px]">Show Stats</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Statistics Cards - Using overallStats that never changes with tabs */}
      {showStatistics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Total Applications */}
          <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {overallStats.totalCoaches}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                  {overallStats.pending}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {overallStats.pendingPercentage}%
                </p>
              </div>
              <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-full">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Verified */}
          <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Verified</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {overallStats.verified}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {overallStats.verifiedPercentage}%
                </p>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-50 rounded-full">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Rejected</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  {overallStats.rejected}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 bg-red-50 rounded-full">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Listed */}
          <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Listed</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {overallStats.listed}
                </p>
              </div>
              <div className="p-1.5 sm:p-2 bg-purple-50 rounded-full">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <h3 className="mb-1 ml-3 text-base font-medium text-gray-700">
          Filter Coaches <span className="text-xs text-muted-foreground">(Select one of the Status Below to Filter the Coaches Data Displayed in the Table.)*</span>
        </h3>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full "
        >
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 ">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-1.5 sm:py-2 cursor-pointer">
              <span className="hidden sm:inline">All </span>
              <span className="sm:hidden">All</span>
              ({overallStats.totalCoaches})
            </TabsTrigger>

            <TabsTrigger
              value="pending"
              className="text-xs sm:text-sm py-1.5 sm:py-2 text-yellow-600 cursor-pointer"
            >
              <span className="hidden sm:inline">Pending </span>
              <span className="sm:hidden">Pending</span>
              ({overallStats.pending})
            </TabsTrigger>

            <TabsTrigger
              value="verified"
              className="text-xs sm:text-sm py-1.5 sm:py-2 text-green-600 cursor-pointer"
            >
              <span className="hidden sm:inline">Verified </span>
              <span className="sm:hidden">Verfied</span>
              ({overallStats.verified})
            </TabsTrigger>

            <TabsTrigger
              value="rejected"
              className="text-xs sm:text-sm py-1.5 sm:py-2 text-red-600 cursor-pointer"
            >
              <span className="hidden sm:inline">Rejected </span>
              <span className="sm:hidden">Rejected</span>
              ({overallStats.rejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-3 sm:p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search - Always visible */}
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                className="w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder="Search coaches..."
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
                  className="text-white border border-black bg-black hover:bg-gray-800 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Clear</span>
                  <span className="sm:hidden">✕</span>
                </Button>
              )}
            </div>

            {/* Filter Dropdown - Desktop */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {[CoachStatus.PENDING, CoachStatus.VERIFIED, CoachStatus.REJECTED].map((status) => {
                      const isActive = filter.some(f => f.key === "status" && f.term === status);

                      return (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => {
                            const isStatusActive = filter.some(f => f.key === "status" && f.term === status);

                            if (isStatusActive) {
                              const otherFilters = filter.filter(f => !(f.key === "status" && f.term === status));
                              onFilter(otherFilters);
                            } else {
                              onFilter([...filter, {
                                key: "status",
                                term: status,
                                type: "SELECT"
                              }]);
                            }
                          }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={isActive}
                              className="mr-2"
                            />
                            <StatusBadge status={status} />
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>

                  {/* Active filters summary */}
                  {filter.some(f => f.key === "status") && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5">
                        <p className="text-xs text-muted-foreground mb-1">Active filters:</p>
                        <div className="flex flex-wrap gap-1">
                          {filter
                            .filter(f => f.key === "status")
                            .map(f => (
                              <Badge key={f.term} variant="outline" className="text-xs">
                                {f.term}
                                <button
                                  className="ml-1 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const otherFilters = filter.filter(f => !(f.key === "status" && f.term === f.term));
                                    onFilter(otherFilters);
                                  }}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    </>
                  )}

                  {/* Clear all button */}
                  {filter.some(f => f.key === "status") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          const otherFilters = filter.filter(f => f.key !== "status");
                          onFilter(otherFilters);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        Clear all filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {isMobileFilterOpen && (
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 sm:hidden">
              <Label className="text-xs font-medium mb-2 block">Filter by Status</Label>
              <div className="space-y-2">
                {[CoachStatus.PENDING, CoachStatus.VERIFIED, CoachStatus.REJECTED].map((status) => {
                  const isActive = filter.some(f => f.key === "status" && f.term === status);

                  return (
                    <div
                      key={status}
                      onClick={() => {
                        const isStatusActive = filter.some(f => f.key === "status" && f.term === status);

                        if (isStatusActive) {
                          const otherFilters = filter.filter(f => !(f.key === "status" && f.term === status));
                          onFilter(otherFilters);
                        } else {
                          onFilter([...filter, {
                            key: "status",
                            term: status,
                            type: "SELECT"
                          }]);
                        }
                      }}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isActive}
                          className="mr-2"
                        />
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {filter.some(f => f.key === "status") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const otherFilters = filter.filter(f => f.key !== "status");
                    onFilter(otherFilters);
                  }}
                  className="w-full mt-2 text-red-600 text-sm"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls - Responsive */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              {loading ? (
                "Loading..."
              ) : filteredNodes.length === 0 ? (
                `No ${activeTab !== "all" ? activeTab : ""} coaches found.`
              ) : (
                <span>
                  <span className="hidden sm:inline">Showing </span>
                  {currentIndex * rows + 1}-{Math.min((currentIndex + 1) * rows, filteredNodes.length)}
                  <span className="hidden sm:inline"> of {filteredNodes.length}</span>
                  {selectedIds.size > 0 && (
                    <span className="ml-2">({selectedIds.size} selected)</span>
                  )}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
              {/* Rows per page - Mobile Dropdown */}
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground sm:hidden">Rows:</span>
                <Select
                  onValueChange={(value) => {
                    setRows(parseInt(value));
                    setCurrentIndex(0);
                    setMaxIndex(0);
                  }}
                  value={rows.toString()}
                >
                  <SelectTrigger className="h-8 sm:h-9 w-20 sm:w-24 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rows</SelectLabel>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-1 sm:gap-2 border rounded-md">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={currentIndex === 0}
                  onClick={goPrev}
                  className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm disabled:opacity-50"
                >
                  <span className="hidden sm:inline">Prev</span>
                  <span className="sm:hidden">←</span>
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2">
                  <span className="hidden sm:inline">Page </span>
                  {currentIndex + 1}<span className="hidden sm:inline"> of {totalPages || 1}</span>
                </span>
                <Button
                  variant="ghost"
                  disabled={currentIndex >= totalPages - 1}
                  onClick={goNext}
                  size="sm"
                  className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm disabled:opacity-50"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table - Responsive */}
        <div className="p-2 sm:p-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <span className="text-xs sm:text-sm text-muted-foreground">Loading coaches...</span>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 border border-dashed rounded-lg p-4">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 text-center">
                No {activeTab !== "all" ? activeTab : ""} coaches found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
                {activeTab === "pending"
                  ? "No pending applications"
                  : activeTab === "verified"
                    ? "No verified coaches yet"
                    : activeTab === "rejected"
                      ? "No rejected applications"
                      : search || filter.length > 0
                        ? "Try adjusting your search"
                        : "No coaches added yet"}
              </p>
              {(search || filter.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 sm:mt-4 text-xs sm:text-sm"
                  onClick={() => {
                    onSearch("");
                    setSearchTerm("");
                    onFilter([]);
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          ) : (
            <div className="min-w-[800px] lg:min-w-full">
              <DataTable
                loading={false}
                columns={columns}
                data={currentPageData}
              />
            </div>
          )}
        </div>
      </div>

      {/* Batch Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Delete Selected Coaches</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete {selectedIds.size} selected coach(es)?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBatchDelete} className="w-full sm:w-auto">
              Delete {selectedIds.size} Coach(es)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
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

      <CoachStatusDialog
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        coach={selectedCoachForStatus}
        onStatusChange={handleStatusChange}
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

export default CoachesManagementPage;