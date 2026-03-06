// components/table/column-filter.tsx
import React, { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  CheckIcon,
  ChevronDownIcon,
  Eraser,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { DateRange } from "react-day-picker"
import { formatDateRange } from "little-date"
import { Calendar } from "@/components/ui/calendar"
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

type IOption = {
  label: string
  value: string
}

const ColumnFilter = ({
  label,
  filterKey,
  filterType,
  filterValue,
  onFilterChange,
  options = [],
}: {
  label: string
  filterKey: string
  filterType:
  | "TEXT"
  | "SELECT"
  | "NUMBER"
  | "NUMBER_RANGE"
  | "DATE"
  | "DATE_RANGE"
  | "BOOLEAN"
  filterValue: { key: string; term: string; type: string }[]
  onFilterChange: (value: any) => void
  options?: IOption[]
}) => {
  const [filterTerm, setFilterTerm] = useState(
    filterValue.find((f) => f.key === filterKey)?.term || ""
  )
  const [openPopover, setOpenPopover] = useState(false)

  // Date Range Picker State
  const [openDateRangePopover, setOpenDateRangePopover] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    if (
      filterType === "DATE_RANGE" &&
      filterValue.find((f) => f.key === filterKey)
    ) {
      const [from, to] = filterValue
        .find((f) => f.key === filterKey)!
        .term.split("_")
      setDateRange({
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      })
    }
  }, [filterType, filterValue, filterKey])

  // Get active filters for this column
  const activeFilters = filterValue.filter(f => f.key === filterKey)
  const hasActiveFilters = activeFilters.length > 0

  // Handle checkbox toggle for SELECT type - IMMEDIATE FILTERING
  const handleSelectToggle = (optionValue: string) => {
    const isActive = activeFilters.some(f => f.term === optionValue)

    if (isActive) {
      // Remove this filter
      const otherFilters = filterValue.filter(f => !(f.key === filterKey && f.term === optionValue))
      onFilterChange(otherFilters)
    } else {
      // Add this filter
      onFilterChange([
        ...filterValue,
        {
          key: filterKey,
          term: optionValue,
          value: optionValue,
          type: "SELECT"
        }
      ])
    }

    // Keep popover open to allow multiple selections (like tab filter)
    // Don't close the popover
  }

  // Handle clear all filters for this column
  const handleClearAll = () => {
    const otherFilters = filterValue.filter(f => f.key !== filterKey)
    onFilterChange(otherFilters)
    setFilterTerm("")
    // Close popover after clearing all
    setOpenPopover(false)
  }

  let filterComponent

  switch (filterType) {
    case "TEXT":
      filterComponent = (
        <div className="flex items-center">
          <Input
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder={`Filter ${label}...`}
            onKeyDown={(e) => {
              const trimmedTerm = filterTerm.trim()
              if (e.key === "Enter") {
                if (!trimmedTerm) {
                  setFilterTerm("")
                  handleClearAll()
                } else {
                  onFilterChange((prev: any) => [
                    ...prev.filter((f: any) => f.key !== filterKey),
                    {
                      key: filterKey,
                      term: trimmedTerm,
                      value: trimmedTerm,
                      type: "TEXT"
                    },
                  ])
                }
              }
            }}
            className={cn(
              "h-8 text-xs",
              hasActiveFilters && "border-blue-500 focus-visible:ring-blue-500"
            )}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 px-2 ml-1"
            >
              <Eraser className="h-3 w-3" />
            </Button>
          )}
        </div>
      )
      break

    // I uncomment ra nako ni puhon
    // case "SELECT":
    //   filterComponent = (
    //     <Popover open={openPopover} onOpenChange={setOpenPopover}>
    //       <PopoverTrigger asChild>
    //         <Button
    //           variant="outline"
    //           size="sm"
    //           className={cn(
    //             "h-8 text-xs font-normal justify-start w-full",
    //             hasActiveFilters && "border-blue-500 bg-blue-50 text-blue-700"
    //           )}
    //         >
    //           <Filter className="h-3 w-3 mr-2" />
    //           <span className="truncate">{label}</span>
    //           {hasActiveFilters && (
    //             <Badge variant="secondary" className="ml-auto text-xs h-5 px-1 min-w-[1.5rem]">
    //               {activeFilters.length}
    //             </Badge>
    //           )}
    //         </Button>
    //       </PopoverTrigger>
    //       <PopoverContent className="w-64 p-3" align="start">
    //         <div className="space-y-3">
    //           {/* Header with title and clear all */}
    //           <div className="flex items-center justify-between">
    //             <Label className="text-sm font-medium">Filter by {label}</Label>
    //             {hasActiveFilters && (
    //               <Button
    //                 variant="ghost"
    //                 size="sm"
    //                 onClick={handleClearAll}
    //                 className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
    //               >
    //                 Clear all
    //               </Button>
    //             )}
    //           </div>

    //           {/* Options with checkboxes - Like tab filter */}
    //           <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
    //             {options?.map((option) => {
    //               const isActive = activeFilters.some(f => f.term === option.value)

    //               return (
    //                 <div
    //                   key={option.value}
    //                   onClick={() => handleSelectToggle(option.value)}
    //                   className={cn(
    //                     "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer",
    //                     "hover:bg-gray-100 transition-colors",
    //                     isActive && "bg-blue-50 hover:bg-blue-100"
    //                   )}
    //                 >
    //                   <Checkbox
    //                     checked={isActive}
    //                     className="h-4 w-4"
    //                   />
    //                   <span className="text-sm flex-1">{option.label}</span>
    //                 </div>
    //               )
    //             })}
    //           </div>

    //           {/* Active filters summary - Like tab filter */}
    //           {hasActiveFilters && (
    //             <div className="border-t pt-2">
    //               <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
    //               <div className="flex flex-wrap gap-1">
    //                 {activeFilters.map(f => {
    //                   const option = options?.find(o => o.value === f.term)
    //                   return (
    //                     <Badge
    //                       key={f.term}
    //                       variant="secondary"
    //                       className="text-xs px-2 py-0.5 flex items-center gap-1"
    //                     >
    //                       {option?.label || f.term}
    //                       <button
    //                         className="hover:text-red-600 focus:outline-none"
    //                         onClick={(e) => {
    //                           e.stopPropagation()
    //                           handleSelectToggle(f.term)
    //                         }}
    //                       >
    //                         ×
    //                       </button>
    //                     </Badge>
    //                   )
    //                 })}
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       </PopoverContent>
    //     </Popover>
    //   )
    //   break

    case "BOOLEAN":
      filterComponent = (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 text-xs font-normal justify-start w-full",
                hasActiveFilters && "border-blue-500 bg-blue-50 text-blue-700"
              )}
            >
              <Filter className="h-3 w-3 mr-2" />
              {label}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-auto text-xs h-5 px-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{label}</Label>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {[
                  { label: "Active", value: "true" },
                  { label: "Inactive", value: "false" }
                ].map((option) => {
                  const isActive = activeFilters.some(f => f.term === option.value)

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelectToggle(option.value)}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer",
                        "hover:bg-gray-100 transition-colors",
                        isActive && "bg-blue-50 hover:bg-blue-100"
                      )}
                    >
                      <Checkbox
                        checked={isActive}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
      break

    // case "DATE_RANGE":
    //   filterComponent = (
    //     <Popover
    //       open={openDateRangePopover}
    //       onOpenChange={setOpenDateRangePopover}
    //     >
    //       <PopoverTrigger asChild>
    //         <Button
    //           variant="outline"
    //           size="sm"
    //           className={cn(
    //             "h-8 text-xs font-normal justify-start w-full",
    //             hasActiveFilters && "border-blue-500 bg-blue-50 text-blue-700"
    //           )}
    //         >
    //           <Filter className="h-3 w-3 mr-2" />
    //           {label}
    //           {hasActiveFilters && (
    //             <Badge variant="secondary" className="ml-auto text-xs h-5 px-1">
    //               1
    //             </Badge>
    //           )}
    //         </Button>
    //       </PopoverTrigger>
    //       <PopoverContent
    //         className="w-auto overflow-hidden p-0 flex"
    //         align="start"
    //       >
    //         <div className="p-2 flex flex-col items-center border-r space-y-1.5">
    //           <Label className="text-xs font-normal text-muted-foreground text-center">
    //             Quick Select
    //           </Label>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="w-full h-7 text-xs"
    //             onClick={() =>
    //               setDateRange({
    //                 from: startOfDay(new Date()),
    //                 to: endOfDay(new Date()),
    //               })
    //             }
    //           >
    //             Today
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="w-full h-7 text-xs"
    //             onClick={() =>
    //               setDateRange({
    //                 from: startOfWeek(new Date()),
    //                 to: endOfWeek(new Date()),
    //               })
    //             }
    //           >
    //             This Week
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="w-full h-7 text-xs"
    //             onClick={() =>
    //               setDateRange({
    //                 from: startOfMonth(new Date()),
    //                 to: endOfMonth(new Date()),
    //               })
    //             }
    //           >
    //             This Month
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="w-full h-7 text-xs"
    //             onClick={() =>
    //               setDateRange({
    //                 from: startOfYear(new Date()),
    //                 to: endOfYear(new Date()),
    //               })
    //             }
    //           >
    //             This Year
    //           </Button>
    //         </div>
    //         <div>
    //           <Calendar
    //             mode="range"
    //             defaultMonth={dateRange?.from}
    //             selected={dateRange}
    //             onSelect={setDateRange}
    //             numberOfMonths={2}
    //             className="p-2"
    //           />
    //           <div className="p-2 flex gap-2 justify-end border-t">
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               className="h-7 text-xs"
    //               onClick={() => {
    //                 setDateRange({ from: undefined, to: undefined })
    //                 handleClearAll()
    //               }}
    //             >
    //               Clear
    //             </Button>
    //             <Button
    //               variant="default"
    //               size="sm"
    //               className="h-7 text-xs"
    //               onClick={() => {
    //                 if (!dateRange?.from || !dateRange?.to) return
    //                 const dateRangeISO = `${format(
    //                   new Date(dateRange?.from),
    //                   "yyyy-MM-dd"
    //                 )}_${format(new Date(dateRange?.to), "yyyy-MM-dd")}`
    //                 onFilterChange((prev: any) => [
    //                   ...prev.filter((f: any) => f.key !== filterKey),
    //                   {
    //                     key: filterKey,
    //                     term: dateRangeISO,
    //                     value: dateRangeISO,
    //                     type: "DATE_RANGE",
    //                   },
    //                 ])
    //                 setOpenDateRangePopover(false)
    //               }}
    //             >
    //               Apply
    //             </Button>
    //           </div>
    //         </div>
    //       </PopoverContent>
    //     </Popover>
    //   )
    //   break

    // case "DATE":
    //   filterComponent = (
    //     <div className="flex items-center">
    //       <Input
    //         type="date"
    //         value={filterTerm}
    //         onChange={(e) => setFilterTerm(e.target.value)}
    //         className={cn(
    //           "h-8 text-xs",
    //           hasActiveFilters && "border-blue-500 focus-visible:ring-blue-500"
    //         )}
    //         onBlur={() => {
    //           if (filterTerm) {
    //             const dateISO = format(new Date(filterTerm), "yyyy-MM-dd")
    //             onFilterChange((prev: any) => [
    //               ...prev.filter((f: any) => f.key !== filterKey),
    //               {
    //                 key: filterKey,
    //                 term: dateISO,
    //                 value: dateISO,
    //                 type: "DATE",
    //               },
    //             ])
    //           }
    //         }}
    //       />
    //       {hasActiveFilters && (
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={handleClearAll}
    //           className="h-8 px-2 ml-1"
    //         >
    //           <Eraser className="h-3 w-3" />
    //         </Button>
    //       )}
    //     </div>
    //   )
    //   break

    default:
      filterComponent = null
  }

  return filterComponent
}

export default ColumnFilter