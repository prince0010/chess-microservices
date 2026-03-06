"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Eraser, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react"
import { DocumentNode } from "@apollo/client"
import { Skeleton } from "@/components/ui/skeleton"
import { IFilterState, ISortState } from "@/modules/shared/interfaces"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  rows: number
  onRowChange: (rows: number) => void
  nextPage: (after?: string) => void
  pageInfo?: {
    total: number
    hasNextPage: boolean
    endCursor: string
  }
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  maxIndex: number
  setMaxIndex: React.Dispatch<React.SetStateAction<number>>
  onSearch: (keyword: string) => void
  filterState: IFilterState[]
  clearFilters: () => void
  sortState?: ISortState
  clearSorting?: () => void
  exportQuery?: DocumentNode
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  actionButtons?: React.ReactNode
  batchMenu?: React.ReactNode
  rowViewDialog?: React.ReactNode
  actions?: React.ReactNode
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  loading = false,
  rows,
  onRowChange,
  nextPage,
  pageInfo,
  currentIndex,
  setCurrentIndex,
  maxIndex,
  setMaxIndex,
  onSearch,
  filterState,
  clearFilters,
  sortState,
  clearSorting,
  rowSelection,
  setRowSelection,
  actionButtons: addButton,
  batchMenu,
  rowViewDialog,
  actions,
}: DataTableProps<TData, TValue>) => {
  const [dataStore, setDataStore] = useState<TData[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: rows,
  })
  const [searchTerm, setSearchTerm] = useState<string>("")

  const totalPages = Math.ceil((pageInfo?.total || 0) / rows)
  const canNextPage = currentIndex < totalPages - 1
  const canPrevPage = currentIndex > 0
  const [openView, setOpenView] = useState<boolean>(false)
  const [viewId, setViewId] = useState<string | null>(null)

  const handleView = (id: string) => {
    setViewId(id)
    setOpenView((prev) => !prev)
  }

  useEffect(() => {
    if (currentIndex >= 0 && rows)
      setPagination({
        pageIndex: currentIndex,
        pageSize: rows,
      })
  }, [currentIndex, rows])

  useEffect(() => {
    if (currentIndex >= maxIndex) setMaxIndex(currentIndex)
  }, [currentIndex, maxIndex, setMaxIndex])

  useEffect(() => {
    setDataStore(data.slice(currentIndex * rows, (currentIndex + 1) * rows))
  }, [data, currentIndex, rows])

  const handleNext = async () => {
    if (canNextPage) {
      if (currentIndex === maxIndex) nextPage(pageInfo?.endCursor)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (canPrevPage) setCurrentIndex((prev) => prev - 1)
  }

  const table = useReactTable({
    data: loading ? Array(10).fill({}) : dataStore,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: totalPages,
    rowCount: pageInfo?.total || 0 / rows,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row._id,
    state: {
      pagination,
      rowSelection,
    },
  })

  return (
    <div className="basis-full flex flex-col gap-1.5 gr">
      {rowViewDialog && (
        <div hidden className="flex justify-end">
          {React.cloneElement(rowViewDialog as React.ReactElement<any>, {
            open: openView,
            setOpen: setOpenView,
            id: viewId,
            setId: setViewId,
          })}
        </div>
      )}
      <div className="w-full flex justify-between">
        <div className="flex">
          <Input
            className={`bg-white ${
              searchTerm
                ? "w-[12.75rem] rounded-tr-none rounded-br-none"
                : "w-60"
            }`}
            placeholder="Search (Press Enter)"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value
              setSearchTerm(value)
              if (!value) onSearch("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch(searchTerm)
              if (e.key === "Escape") {
                setSearchTerm("")
                onSearch("")
              }
            }}
          />
          {searchTerm && (
            <Button
              size="icon"
              className="w-9 rounded-tl-none rounded-bl-none transition-all bg-destructive hover:bg-destructive/80"
              onClick={() => {
                setSearchTerm("")
                onSearch("")
              }}
            >
              <XIcon />
            </Button>
          )}
        </div>
        <div className="flex gap-1">
          {Object.keys(rowSelection).length ? (
            <Button variant="destructive" onClick={() => setRowSelection({})}>
              <Eraser /> Clear Selection
            </Button>
          ) : null}

          {sortState?.key !== "_id" && (
            <Button variant="destructive" onClick={clearSorting}>
              <Eraser /> Clear Sorting
            </Button>
          )}
          {filterState.length > 0 && (
            <Button variant="destructive" onClick={clearFilters}>
              <Eraser /> Clear Filters
            </Button>
          )}
          {Object.keys(rowSelection).length ? batchMenu : null}
          {addButton}
        </div>
      </div>
      <div className="flex items-center justify-between h-12 border-t">
        {loading ? (
          <span className="flex text-sm  items-center justify-center w-full text-muted-foreground">
            <span className="animate-bounce">L</span>
            <span className="animate-bounce delay-150">o</span>
            <span className="animate-bounce delay-300">a</span>
            <span className="animate-bounce delay-450">d</span>
            <span className="animate-bounce delay">i</span>
            <span className="animate-bounce delay-150">n</span>
            <span className="animate-bounce delay-300">g</span>
            <span className="animate-bounce delay-450">.</span>
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
          </span>
        ) : pageInfo?.total ? (
          <>
            <div className="text-muted-foreground text-sm flex gap-1 justify-start items-center ml-2">
              <span>
                Showing {currentIndex * rows + 1}-
                {Math.min((currentIndex + 1) * rows, table.getRowCount())} out
                of {pageInfo?.total} results. (
                {Math.floor((data.length / (pageInfo?.total ?? 0)) * 100)}%){" "}
                {Object.keys(rowSelection).length > 0 &&
                  `(${Object.keys(rowSelection).length} rows selected)`}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-sm">
                  Rows per page
                </span>
                <Select
                  onValueChange={(value) => onRowChange(parseInt(value))}
                  value={rows.toString()}
                >
                  <SelectTrigger className="bg-white w-19">
                    <SelectValue placeholder="Row Count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="250">250</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-muted-foreground text-sm">
                Page {table.getPageCount() ? currentIndex + 1 : 0} of{" "}
                {table.getPageCount()}
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={!canPrevPage}
                  size="icon"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={!canNextPage}
                  size="icon"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <span className="text-center text-muted-foreground w-full text-sm py-1.25">
            No results found.
          </span>
        )}
      </div>
      <div className="rounded-sm border bg-white overflow-y-auto max-h-[calc(100vh-210px)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="truncate"
                      key={header.id}
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => {
                  return (
                    <TableHead
                      key={footer.id}
                      style={{
                        width: `${footer.getSize()}px`,
                      }}
                    >
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(() => {
              if (loading)
                return (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[calc(100vh-310px)] w-full"
                    >
                      <Skeleton className="h-full w-full" />
                    </TableCell>
                  </TableRow>
                )
              if (table.getRowModel().rows?.length)
                return table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        onClick={() => {
                          if (
                            cell.column.id == "select" ||
                            cell.column.id == "actions"
                          )
                            return
                          handleView?.(row.original._id.toString())
                        }}
                        style={{
                          width: `${cell.column.getSize()}px`,
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {actions ? (
                      <TableCell className="w-2">
                        {React.cloneElement(
                          actions as React.ReactElement<any>,
                          {
                            data: row.original,
                          }
                        )}
                      </TableCell>
                    ) : undefined}
                  </TableRow>
                ))
              if (data.length === 0)
                return (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[calc(100vh-310px)] w-full"
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <span>No results.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
