import React from "react"
import { Button } from "../ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

const SortHeader = ({
  label,
  sortKey,
  sortState: sortState,
  onSortChange,
}: {
  label: string
  sortKey: string
  sortState: { key: string; order: "ASC" | "DESC" } | null
  onSortChange: (sort: { key: string; order: "ASC" | "DESC" } | null) => void
}) => {
  return (
    <div>
      <Button
        className="p-0 text-foreground"
        size="sm"
        variant="link"
        onClick={() => {
          if (!sortState || sortState.key !== sortKey) {
            onSortChange({ key: sortKey, order: "ASC" })
          } else if (sortState.order === "ASC" && sortState.key === sortKey) {
            onSortChange({ key: sortKey, order: "DESC" })
          } else if (sortState.order === "DESC" && sortState.key === sortKey) {
            onSortChange(null)
          }
        }}
      >
        {label}
        <div>
          {sortState?.key === sortKey ? (
            sortState.order == "ASC" ? (
              <ArrowUp />
            ) : (
              <ArrowDown />
            )
          ) : (
            <ArrowUpDown />
          )}
        </div>
      </Button>
    </div>
  )
}

export default SortHeader
