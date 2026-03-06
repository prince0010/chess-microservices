import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ChevronDownIcon, XIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IFilterState, TFilterType } from "@/modules/shared/interfaces"
import { Label } from "./ui/label"

type ColumnFilterProps = {
  state: IFilterState[]
  set: React.Dispatch<React.SetStateAction<IFilterState[]>>
  type?: TFilterType
  sortKey: string
  displayName?: string
  reset: () => void
  options?: { label: string; value: string }[]
}

const ColumnFilter = ({
  state,
  set,
  type = "TEXT",
  sortKey,
  displayName,
  reset: resetPages,
  options,
}: ColumnFilterProps) => {
  // Text Filters
  const [filter, setFilter] = useState<string>(
    state.find((f) => f.key === sortKey && f.type == "TEXT")?.term || ""
  )

  // Date Filters
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  useEffect(() => {
    if (state.find((f) => f.key === sortKey && f.type == "DATE")) {
      const dates = state
        ?.find((f) => f.key === sortKey && f.type == "DATE")
        ?.term?.split("_")
      const from = dates ? new Date(dates[0]) : undefined
      const to = dates ? new Date(dates[1]) : undefined
      setDate({ from, to })
    }
  }, [sortKey, state])

  const reset = () => {
    setFilter("")
    setDate({ from: undefined, to: undefined })
    set((prev) => prev.filter((f) => f.key !== sortKey))
    resetPages()
  }

  switch (type) {
    case "TEXT":
      return (
        <div className="flex my-1.5">
          <Input
            className={`${filter ? "rounded-tr-none rounded-br-none" : undefined
              }`}
            value={filter}
            placeholder={displayName}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                set((prev) => [
                  ...prev.filter((f) => f.key !== sortKey),
                  { key: sortKey, type, term: filter },
                ])
                resetPages()
              }
              if (e.key === "Escape") reset()
            }}
          />
          {filter && (
            <Button
              size="icon"
              className="w-9 rounded-tl-none rounded-bl-none transition-all bg-destructive hover:bg-destructive/80"
              onClick={reset}
            >
              <XIcon />
            </Button>
          )}
        </div>
      )
    case "DATE":
      return (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full " variant="outline">
                <span className="w-full text-left text-muted-foreground">
                  {date?.from
                    ? `${format(date.from, "PP, h:mm a")}` +
                    (date?.to && date.to !== date.from
                      ? ` - ${format(date.to, "PP, h:mm a")}`
                      : "")
                    : `Filter ${displayName}`}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="start">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Label className="col-span-3">From Date</Label>
                    <Popover open={openFrom} onOpenChange={setOpenFrom}>
                      <PopoverTrigger className="col-span-2" asChild>
                        <Button
                          variant="outline"
                          id="date-from"
                          className="w-full justify-between font-normal"
                        >
                          {date?.from
                            ? date.from.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date?.from}
                          disabled={date?.to ? { after: date.to } : undefined}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate((prev) => ({ ...prev, from: date }))
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      id="time-from"
                      step="60"
                      defaultValue={
                        date?.from
                          ? date.from.toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "00:00"
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      onChange={(e) => {
                        if (date?.from) {
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number)
                          const updatedDate = new Date(date.from.getTime())
                          updatedDate.setHours(hours || 0, minutes || 0, 0, 0)
                          setDate((prev) => ({ ...prev, from: updatedDate }))
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label className="col-span-3">To Date</Label>
                    <Popover open={openTo} onOpenChange={setOpenTo}>
                      <PopoverTrigger className="col-span-2" asChild>
                        <Button
                          variant="outline"
                          id="date-to"
                          className="w-full justify-between font-normal"
                        >
                          {date?.to
                            ? date.to.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date?.to}
                          captionLayout="dropdown"
                          disabled={
                            date?.from ? { before: date.from } : undefined
                          }
                          onSelect={(date) => {
                            setDate((prev: any) => ({
                              from: prev.from,
                              to: date,
                            }))
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      id="time-to"
                      step="60"
                      defaultValue={
                        date?.to
                          ? date.to.toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "23:59"
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      onChange={(e) => {
                        if (date?.to) {
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number)
                          const updatedDate = new Date(date.to.getTime())
                          updatedDate.setHours(hours || 0, minutes || 0, 0, 0)
                          setDate((prev) => ({
                            from: prev?.from,
                            to: updatedDate,
                          }))
                        }
                      }}
                    />
                  </div>
                  <div className="w-full col-span-2 flex justify-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const dateFilter = `${date?.from?.toISOString()}_${date?.to?.toISOString()}`
                        set((prev) => [
                          ...prev.filter((f) => f.key !== sortKey),
                          { key: sortKey, type, term: dateFilter },
                        ])
                        resetPages()
                      }}
                    >
                      Filter
                    </Button>
                    <Button
                      onClick={() => {
                        const today = new Date()
                        const startOfToday = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate(),
                          0,
                          0,
                          0
                        )
                        const endOfToday = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate(),
                          23,
                          59,
                          59
                        )
                        setDate({ from: startOfToday, to: endOfToday })
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={reset}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        // <Popover modal>
        //   <PopoverTrigger asChild>
        //     <Button
        //       id="date"
        //       variant="outline"
        //       className={cn(
        //         "my-1 w-full justify-start text-left truncate text-muted-foreground font-medium",
        //         !date && "text-muted-foreground"
        //       )}
        //     >
        //       <CalendarIcon />
        //       {date?.from ? (
        //         date.to ? (
        //           <span className="truncate">
        //             {format(date.from, "LLL d, y")}
        //             {date.from.getTime() !== date.to.getTime() && (
        //               <> - {format(date.to, "LLL d, y")}</>
        //             )}
        //           </span>
        //         ) : (
        //           format(date.from, "LLL d, y")
        //         )
        //       ) : (
        //         <span>Pick a date</span>
        //       )}
        //     </Button>
        //   </PopoverTrigger>
        //   <PopoverContent className="w-auto p-0" align="start">
        //     <Calendar
        //       mode="range"
        //       defaultMonth={new Date()}
        //       selected={date}
        //       onSelect={setDate}
        //       numberOfMonths={1}
        //     />
        //     <div className="px-2 pb-2 flex gap-0.5 justify-end">
        //       {!!(date?.from && date?.to) && (
        //         <Button
        //           variant="link"
        //           onClick={() => {
        //             const dateFilter = `${date?.from?.toISOString()}_${date?.to?.toISOString()}`
        //             set((prev) => [
        //               ...prev.filter((f) => f.key !== sortKey),
        //               { key: sortKey, type, term: dateFilter },
        //             ])
        //             resetPages()
        //           }}
        //         >
        //           Filter
        //         </Button>
        //       )}
        //       <Button variant="link" onClick={reset}>
        //         Clear
        //       </Button>
        //     </div>
        //   </PopoverContent>
        // </Popover>
      )
    case "SELECT":
      return (
        <Select
          value={state.find((f) => f.key === sortKey)?.term}
          onValueChange={(value) => {
            if (value === "none") {
              set((prev) => prev.filter((f) => f.key !== sortKey))
              resetPages()
            } else {
              set((prev) => [
                ...prev.filter((f) => f.key !== sortKey),
                { key: sortKey, type, term: value },
              ])
              resetPages()
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={displayName} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{displayName}</SelectLabel>
              <SelectItem
                value="none"
                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              >
                Clear Filter
              </SelectItem>
              {options?.map(({ label, value }) => {
                return (
                  <SelectItem
                    className={
                      value === "INACTIVE" ? "text-primary" : undefined
                    }
                    key={value}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )
  }
}

export default ColumnFilter
