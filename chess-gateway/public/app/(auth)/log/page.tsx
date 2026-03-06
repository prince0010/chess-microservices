"use client"
import { useMemo, useState } from "react"
import { ColumnDef, RowSelectionState } from "@tanstack/react-table"

import ColumnFilter from "@/components/column-filter"
import SortingHeader from "@/components/sorting-header"
import { DataTable } from "@/components/data-table"
import { IFilterState, ISortState } from "@/modules/shared/interfaces"
import { ILog } from "@/modules/log/interfaces"
import { useFetchLogTable } from "@/modules/log/hooks"

const Page = () => {
  // Page States
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [maxIndex, setMaxIndex] = useState<number>(0)
  const [rows, setRows] = useState<number>(10) // Limit per page
  const [searchKeyword, setSearchKeyword] = useState<string>("") // Global search keyword
  const [filterState, setFilterState] = useState<IFilterState[]>([]) // Per-column filtering state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sortState, setSortState] = useState<ISortState>({
    key: "_id",
    order: "DESC",
  })
  const {
    data: queryData,
    loading,
    fetchMore,
  } = useFetchLogTable({
    first: rows * (currentIndex + 1),
    search: searchKeyword,
    filter: filterState,
    sort: sortState,
  })

  // Fetch Data
  const { data, pageInfo } = useMemo(() => {
    const edges = queryData?.fetchLogTable.edges ?? []
    const uniqueNodes = Array.from(
      new Map(
        edges.map(({ node }: { node: ILog }) => [node._id, node])
      ).values()
    )
    return {
      data: uniqueNodes,
      pageInfo: queryData?.fetchLogTable.pageInfo,
    }
  }, [queryData])

  const columns: ColumnDef<ILog | any>[] = useMemo(
    () => [
      {
        accessorKey: "user.firstName",
        header: () => (
          <SortingHeader
            displayName="User"
            sortKey="user"
            state={sortState}
            resetPages={resetIndexes}
            set={setSortState}
          />
        ),
        footer: () => (
          <ColumnFilter
            state={filterState}
            set={setFilterState}
            sortKey="user"
            displayName="User"
            reset={resetIndexes}
          />
        ),
        cell: ({ row, getValue }) => {
          const firstName = getValue() as string
          const lastName = row.original.user.lastName
          return <span>{firstName + " " + lastName}</span>
        },
        size: 50,
      },
      {
        accessorKey: "action",
        header: () => (
          <SortingHeader
            displayName="Action"
            sortKey="action"
            state={sortState}
            resetPages={resetIndexes}
            set={setSortState}
          />
        ),
        footer: () => (
          <ColumnFilter
            state={filterState}
            set={setFilterState}
            sortKey="action"
            displayName="Action"
            reset={resetIndexes}
          />
        ),
        size: 500,
      },
    ],
    [filterState, sortState]
  )

  const nextPage = async (after?: string) => {
    if (pageInfo?.hasNextPage && after) {
      // Wait until prev is not null or loading is false
      if (!queryData || loading) {
        // Optionally, you can show a loading indicator here
        return
      }
      await fetchMore({
        variables: {
          first: rows,
          after,
          search: searchKeyword,
        },
        updateQuery: (
          prev: { fetchLogTable: { edges: any[] } },
          { fetchMoreResult }: any
        ) => {
          if (!fetchMoreResult) return prev
          // If prev is still null or loading, skip updating
          if (!prev || loading) return prev
          return {
            fetchLogTable: {
              ...fetchMoreResult?.fetchLogTable,
              edges: [
                ...prev?.fetchLogTable?.edges,
                ...fetchMoreResult.fetchLogTable?.edges,
              ],
              pageInfo: fetchMoreResult.fetchLogTable?.pageInfo, // Update pagination info
            },
          }
        },
      })
    }
  }

  // Reset Pages
  const resetIndexes = () => {
    setMaxIndex(0)
    setCurrentIndex(0)
  }

  const onSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    resetIndexes()
  }

  const onRowChange = (rows: number) => {
    setRows(rows)
    resetIndexes()
  }

  return (
    <div className="h-full w-full flex flex-col gap-1 p-3">
      <span className="block text-2xl text-foreground font-semibold">Logs</span>
      <DataTable
        columns={columns}
        data={data}
        loading={!queryData && loading}
        rows={rows}
        onRowChange={onRowChange}
        nextPage={nextPage}
        pageInfo={pageInfo}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        maxIndex={maxIndex}
        setMaxIndex={setMaxIndex}
        onSearch={onSearch}
        filterState={filterState}
        clearFilters={() => {
          resetIndexes()
          setFilterState([])
        }}
        sortState={sortState}
        clearSorting={() => {
          resetIndexes()
          setSortState({ key: "_id", order: "DESC" })
        }}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
      />
    </div>
  )
}

export default Page
