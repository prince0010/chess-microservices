import { Button } from "@/components/ui/button"
import { ISortState } from "@/modules/shared/interfaces"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import React from "react"

type SortingHeaderProps = {
  set: React.Dispatch<React.SetStateAction<ISortState>>
  state: ISortState
  resetPages: () => void
  sortKey: string
  displayName: string
}

const SortingHeader = ({
  set: setSortState,
  state: sortState,
  resetPages,
  sortKey,
  displayName: headerName,
}: SortingHeaderProps) => (
  <Button
    variant="link"
    className="w-full flex justify-start text-accent-foreground -ml-3 my-1"
    onClick={() => {
      setSortState({
        key: sortKey,
        order: sortState?.order === "ASC" ? "DESC" : "ASC",
      })
      resetPages()
    }}
  >
    {headerName}
    {sortState?.key === sortKey ? (
      sortState.order == "ASC" ? (
        <ArrowUp />
      ) : (
        <ArrowDown />
      )
    ) : (
      <ArrowUpDown />
    )}
  </Button>
)

export default SortingHeader
