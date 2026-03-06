import { Checkbox } from "@/components/ui/checkbox"
import { RowSelectionState } from "@tanstack/react-table"
import React from "react"

type SelectionHeaderProps = {
  data: any
  set: React.Dispatch<React.SetStateAction<RowSelectionState>>
  state: RowSelectionState
}

const SelectionHeader = ({ data, set, state }: SelectionHeaderProps) => (
  <Checkbox
    checked={
      Object.keys(state).length > 0 &&
      data.every((item: any) => state[item._id])
    }
    onCheckedChange={(value) => {
      const selected = data.reduce((acc: any, item: any) => {
        acc[item._id] = true
        return acc
      }, {})
      set(value ? selected : {})
    }}
  />
)

export default SelectionHeader
