"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import * as React from 'react';

interface CreditDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  renderExpandedContent?: (data: TData) => React.ReactNode;
  getRowId?: (originalRow: TData, index: number) => string;
  expandedRowIds?: Set<string>;
  onExpandedChange?: (expandedRowIds: Set<string>) => void;
}

export function CreditDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  renderExpandedContent,
  getRowId = (_, index) => index.toString(),
  // New props with defaults
  expandedRowIds,
  onExpandedChange,
}: CreditDataTableProps<TData, TValue>) {
  // Internal state for expanded rows if not controlled
  const [internalExpandedRows, setInternalExpandedRows] = useState<Set<string>>(new Set());

  // Use controlled state if provided, otherwise use internal state
  const expandedRows = expandedRowIds !== undefined ? expandedRowIds : internalExpandedRows;
  const setExpandedRows = onExpandedChange !== undefined ? onExpandedChange : setInternalExpandedRows;

  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleRow = (rowId: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(rowId)) {
      newSet.delete(rowId);
    } else {
      newSet.add(rowId);
    }
    setExpandedRows(newSet);
  };

  // Add expand/collapse column to the table
  const tableColumns = [
    ...columns,
    {
      id: "expand",
      header: () => null,
      cell: ({ row }: { row: any }) => {
        const isExpanded = expandedRows.has(row.id);
        return (
          <div className="flex justify-center">
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        );
      },
      size: 50,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: (header.column.columnDef as any).size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
                <TableHead
                  key="expand-header"
                  style={{ width: 50 }}
                ></TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                key="loading-cell"
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: (header.column.columnDef as any).size,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
              <TableHead key="expand-header" style={{ width: 50 }}></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isExpanded = expandedRows.has(row.id);

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                      isExpanded && "bg-muted/30"
                    )}
                    onClick={() => toggleRow(row.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: (cell.column.columnDef as any).size,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell style={{ width: 50 }}>
                      <div className="flex justify-center">
                        <ChevronDownIcon
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && renderExpandedContent && (
                    <TableRow>
                      <TableCell
                        colSpan={tableColumns.length}
                        className="p-0 bg-muted/20"
                      >
                        {renderExpandedContent(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                key="no-results"
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}