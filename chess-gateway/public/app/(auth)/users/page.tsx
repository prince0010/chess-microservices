"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ColumnFilter from "@/components/table/column-filter";
import SortHeader from "@/components/table/sort-header";
import DataTable from "@/components/table/data-table";
import { useFetchUserTable } from "@/modules/user/hooks";
import { IUser } from "@/modules/user/interfaces";
import { cn } from "@/lib/utils";
import RoleBadge from "@/components/role-badge";
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
    SettingsIcon,
    Trash2Icon,
    UserCircle,
    InfoIcon,
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSSE } from "@/components/layouts/sse";
import ViewDialog from "./dialogs/view";
import StatusDialog from "./dialogs/status";
import DeleteDialog from "./dialogs/delete";
import FormDialog from "./dialogs/form";
import BatchDeleteDialog from "./dialogs/batch-delete";

const ActionsColumn = ({
    data,
    refreshTable,
}: {
    data?: any;
    refreshTable: () => void;
}) => {
    const user = data as IUser;
    const _id = user?._id.toString();
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Stop propagation for all clicks within the actions column
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div onClick={stopPropagation} className="inline-flex">
            <DropdownMenu modal>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <SettingsIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-40" side="left" align="start">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setViewOpen(true);
                            }}
                            className="cursor-pointer"
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setEditOpen(true);
                            }}
                            className="cursor-pointer"
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setDeleteOpen(true);
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2Icon className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setStatusOpen(true);
                            }}
                            className="cursor-pointer"
                        >
                            Change Status
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <ViewDialog _id={_id} open={viewOpen} onOpenChange={setViewOpen} />
            <FormDialog
                id={_id}
                open={editOpen}
                onOpenChange={setEditOpen}
                refetch={refreshTable}
            />
            <StatusDialog
                id={_id}
                open={statusOpen}
                onOpenChange={setStatusOpen}
                refetch={refreshTable}
            />

            <DeleteDialog
                id={_id}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                refetch={refreshTable}
                userName={`${user?.firstName} ${user?.lastName}`}
            />
        </div>
    );
};

const Page = () => {
    // Page States
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [_page, setPage] = useState<{
        current: number;
        loaded: number;
        max: number;
    }>({
        current: 1,
        loaded: 1,
        max: 1,
    });
    // Global Search
    const [search, setSearch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    // Column Sorting - Always provide a default sort
    const [sort, setSort] = useState<{
        key: string;
        order: "ASC" | "DESC";
    }>({ key: "_id", order: "DESC" });
    // Column Filtering
    const [filter, setFilter] = useState<
        { key: string; term: string; type: string }[]
    >([
        { key: "role", term: "user", type: "SELECT" }
    ]);
    // Selected Rows
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);

    const { eventData, clearEventData } = useSSE();

    const {
        data: queryData,
        loading,
        fetchMore,
        refetch,
        error,
    } = useFetchUserTable({
        // first: rows * (currentIndex + 1),
        first: rows,
        search,
        sort,
        filter,
    });
    console.log("queryData:", queryData);
    console.log("error:", error);

    console.log("queryData:", queryData);
    console.log("fetchUserTable:", queryData?.fetchUserTable);
    console.log("edges:", queryData?.fetchUserTable?.edges);

    useEffect(() => {
        if (eventData) {
            console.log("User page received event:", eventData);
            const { type, payload } = eventData;

            // Listen for USER events
            if (
                (type === "USER_UPDATE" || type === "USER_DELETE") &&
                payload.refetch
            ) {
                console.log("Refetching user table...");
                refetch();
            }

            clearEventData();
        }
    }, [clearEventData, eventData, refetch]);

    // Memoized Data Processing - FIXED
    const { total, nodes, pageInfo } = useMemo(() => {
        const edges = queryData?.fetchUserTable?.edges ?? [];
        // Get unique nodes (like requests page)
        const uniqueNodes = Array.from(
            new Map(edges.map(({ node }: any) => [node._id, node])).values()
        ) as IUser[];

        const pageInfo = queryData?.fetchUserTable?.pageInfo;
        const totalCount = pageInfo?.total || 0;

        return {
            total: totalCount,
            nodes: uniqueNodes,
            pageInfo,
        };
    }, [queryData]);

    const currentPageData = useMemo(() => {
        const start = currentIndex * rows;
        const end = start + rows;
        return nodes.slice(start, end);
    }, [nodes, currentIndex, rows]);

    const refreshTable = useCallback(() => {
        refetch();
    }, [refetch]);

    // Reset to First Page
    const resetPage = () => setPage({ current: 1, loaded: 1, max: 1 });

    // On Search
    const onSearch = (value: string) => {
        setSearch(value);
        resetIndexes();
    };

    // On Filter
    const onFilter = useCallback((value: any) => {
        setFilter(value);
        resetPage();
    }, []);

    // On Sort - Updated to handle default sort
    const onSort = useCallback((value: any) => {
        // If value is null, reset to default sort
        if (!value) {
            setSort({ key: "_id", order: "DESC" });
        } else {
            setSort(value);
        }
        resetPage();
    }, []);

    const totalPages = Math.ceil(total / rows);

    const handleBatchDeleteSuccess = () => {
        setSelectedIds(new Set()); // Clear selection after successful batch delete
        refetch(); // Refresh the table
    };

    // Table Columns
    const columns: ColumnDef<IUser>[] = useMemo(
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
                                        nodes.map((user: IUser) => user._id.toString())
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
                    const isChecked = selectedIds.has(
                        (row.original as any)._id.toString()
                    );
                    return (
                        <Checkbox
                            checked={isChecked}
                            className="hover:cursor-pointer"
                            onCheckedChange={(value: boolean) => {
                                setSelectedIds((prev) => {
                                    const newSet = new Set(prev);
                                    if (value) {
                                        newSet.add((row.original as any)._id.toString());
                                    } else {
                                        newSet.delete((row.original as any)._id.toString());
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
                accessorKey: "lastName",
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
                cell: ({ row }) =>
                    `${row.original.lastName}, ${row.original.firstName}`,
            },
            {
                accessorKey: "username",
                header: () => (
                    <SortHeader
                        label="Username"
                        sortKey="username"
                        sortState={sort}
                        onSortChange={onSort}
                    />
                ),
                footer: () => (
                    <ColumnFilter
                        label="Username"
                        filterKey="username"
                        filterType="TEXT"
                        filterValue={filter}
                        onFilterChange={onFilter}
                    />
                ),
            },
            {
                accessorKey: "role",
                header: () => (
                    <SortHeader
                        label="Role"
                        sortKey="role"
                        sortState={sort}
                        onSortChange={onSort}
                    />
                ),
                footer: () => (
                    <ColumnFilter
                        label="Role"
                        filterKey="role"
                        filterType="SELECT"
                        filterValue={filter}
                        onFilterChange={onFilter}
                        options={[
                            { label: "Admin", value: "admin" },
                            { label: "Coach", value: "coach" },
                            { label: "User", value: "user" },
                        ]}
                    />
                ),
                cell: ({ row }) => (
                    <RoleBadge key={row.original.role} type={row.original.role} />
                ),
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
                        filterType="BOOLEAN"
                        filterValue={filter}
                        onFilterChange={onFilter}
                    />
                ),
                cell: ({ row }) => (
                    <div
                        className={cn(
                            "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                            row.original.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        )}
                    >
                        {row.original.status ? "Active" : "Inactive"}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <ActionsColumn data={row.original} refreshTable={refreshTable} />
                ),
                size: 100,
            },
        ],
        [sort, onSort, filter, onFilter, selectedIds, nodes, refreshTable]
    );

    // Next Page - FIXED
    const goNext = async () => {
        if (currentIndex >= totalPages - 1) return;

        // If we need to fetch more data
        if (currentIndex === maxIndex && pageInfo?.hasNextPage) {
            try {
                await fetchMore({
                    variables: {
                        first: rows,
                        after: pageInfo.endCursor,
                        search,
                        sort,
                        filter,
                    },
                    updateQuery: (prev: any, { fetchMoreResult: more }: any) => {
                        if (!more) return prev;
                        return {
                            fetchUserTable: {
                                ...more.fetchUserTable,
                                edges: [
                                    ...prev.fetchUserTable.edges,
                                    ...more.fetchUserTable.edges,
                                ],
                            },
                        };
                    },
                });
                setMaxIndex((prev) => prev + 1);
            } catch (error) {
                console.error("Error fetching more:", error);
                return;
            }
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const resetIndexes = () => {
        setCurrentIndex(0);
        setMaxIndex(0);
    };

    // Check if we're using default sort (for clear sorting button)
    const isDefaultSort = sort.key === "_id" && sort.order === "DESC";

    return (
        <div className="w-full h-full flex-1 flex flex-col gap-2 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-900 -mb-1.5">
                    <UserCircle className="size-5" />
                    <Label className="text-2xl">Users</Label>
                </div>
            </div>

            {/* Search and Action Buttons */}
            <div className="w-full flex justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        className="w-[350px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        placeholder="Type to search..."
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
                            variant="outline-destructive"
                            onClick={() => {
                                onSearch("");
                                setSearchTerm("");
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {selectedIds.size > 0 && (
                        <>
                            <Button
                                variant="outline-destructive"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                <Trash2Icon className="size-3.5" />
                                Clear Selection
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setBatchDeleteOpen(true)}
                            >
                                <Trash2Icon className="size-3.5" />
                                Delete Selected ({selectedIds.size})
                            </Button>
                        </>
                    )}
                    {/* Only show clear sorting if not using default sort */}
                    {!isDefaultSort && (
                        <Button variant="outline-destructive" onClick={() => onSort(null)}>
                            <Trash2Icon className="size-3.5" />
                            Clear Sorting
                        </Button>
                    )}
                    {filter.length > 0 && (
                        <Button variant="outline-destructive" onClick={() => onFilter([])}>
                            <Trash2Icon className="size-3.5" />
                            Clear Filtering
                        </Button>
                    )}
                    <FormDialog refetch={refreshTable} />
                </div>
            </div>

            {/* Table Info and Pagination Controls */}
            <div className="w-full flex justify-between">
                <div className="px-1.5 flex items-center justify-center">
                    {loading ? (
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    ) : total === 0 ? (
                        <span className="text-sm text-muted-foreground">No results.</span>
                    ) : (
                        <div className="space-x-0.5">
                            <span className="text-sm text-muted-foreground">
                                Showing {currentIndex * rows + 1}-
                                {Math.min((currentIndex + 1) * rows, total)} out of {total}{" "}
                                result
                                {total === 1 ? "" : "s"}.{" "}
                                {selectedIds.size > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        ({selectedIds.size} row{selectedIds.size > 1 ? "s" : ""}{" "}
                                        selected)
                                    </span>
                                )}
                            </span>
                            {(search || filter.length > 0 || !isDefaultSort) && (
                                <Tooltip>
                                    <TooltipTrigger className="hover:cursor-pointer text-muted-foreground">
                                        <InfoIcon className="size-3.25" />
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="center">
                                        <div className="flex flex-col">
                                            {search && (
                                                <div>
                                                    <span className="block">
                                                        Search term:{" "}
                                                        <span className="block">
                                                            {" "}
                                                            • &quot;{search}&quot;
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                            {!isDefaultSort && (
                                                <div>
                                                    <span className="block">
                                                        Sorted by:
                                                        <span className="block">
                                                            • {sort.key} → {sort.order}
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                            {filter.length > 0 && (
                                                <div>
                                                    <span className="block">
                                                        Filtered by:
                                                        {filter.map((f, i) => (
                                                            <span className="block" key={i}>
                                                                • {f.key} → {f.term}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <span className="text-sm text-muted-foreground">Rows</span>
                            <Select
                                onValueChange={(value) => {
                                    setRows(parseInt(value));
                                    resetPage();
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
                    </div>

                    <div className="flex items-center gap-2">
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
                                Page {currentIndex + 1} of {totalPages}
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

            <DataTable
                loading={false}
                columns={columns}
                data={currentPageData}
            />

            <BatchDeleteDialog
                open={batchDeleteOpen}
                onOpenChange={setBatchDeleteOpen}
                selectedIds={Array.from(selectedIds)}
                onSuccess={handleBatchDeleteSuccess}
                refetch={refreshTable}
            />
        </div>
    );
};

export default Page;