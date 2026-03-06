"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { isToday, isAfter, setHours, setMinutes } from "date-fns"

interface TimePickerProps {
    value?: string
    onChange: (time: string) => void
    className?: string
    disabled?: boolean
    selectedDate?: Date // Add this to check if the selected date is today
}

const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
]

export function TimePicker({
    value,
    onChange,
    className,
    disabled = false,
    selectedDate
}: TimePickerProps) {
    const [open, setOpen] = React.useState(false)

    const isTimeDisabled = (time: string) => {
        if (!selectedDate) return false

        if (isToday(selectedDate)) {
            const now = new Date()
            const [timeStr, period] = time.split(' ')
            const [hours, minutes] = timeStr.split(':').map(Number)

            let adjustedHours = hours
            if (period === 'PM' && adjustedHours !== 12) adjustedHours += 12
            if (period === 'AM' && adjustedHours === 12) adjustedHours = 0

            const timeDate = setHours(setMinutes(selectedDate, minutes), adjustedHours)
            return !isAfter(timeDate, now)
        }
        return false
    }

    const availableTimeSlots = timeSlots.filter(time => !isTimeDisabled(time))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="time-picker"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value || <span>Select time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                    <span className="text-xs font-medium text-muted-foreground">
                        {selectedDate && isToday(selectedDate)
                            ? "Available Time Slots (Future)"
                            : "Available Time Slots"}
                    </span>
                </div>
                <ScrollArea className="h-72 w-56">
                    <div className="p-2 flex flex-col gap-1">
                        {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((time) => (
                                <Button
                                    key={time}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start font-normal hover:bg-accent hover:text-accent-foreground",
                                        value === time && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => {
                                        onChange(time)
                                        setOpen(false)
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>{time}</span>
                                        {value === time && (
                                            <Badge variant="outline" className="ml-2 h-5 px-1.5 text-[0.65rem]">
                                                Selected
                                            </Badge>
                                        )}
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <span className="text-sm text-muted-foreground">
                                    No available time slots
                                </span>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t">
                    <span className="text-[0.65rem] text-muted-foreground">
                        All lessons will be scheduled start at this time.
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    )
}