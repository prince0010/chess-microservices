"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange, type Matcher } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "./field"

interface DatePickerRangeProps {
    date?: DateRange
    onSelect?: (date?: DateRange) => void
    label?: string
    disabled?: boolean
    disabledDays?: Matcher | Matcher[] | undefined
    className?: string
    placeholder?: string
}

export function DatePickerWithRange({
    date: externalDate,
    onSelect,
    label = "Date Picker Range",
    disabled = false,
    disabledDays,
    className,
    placeholder = "Pick a date range"
}: DatePickerRangeProps) {
    const [internalDate, setInternalDate] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 20),
        to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    })

    // Use either controlled or uncontrolled state
    const date = externalDate !== undefined ? externalDate : internalDate;

    const handleDateChange = (newDate: DateRange | undefined) => {
        if (onSelect) {
            onSelect(newDate);
        } else {
            setInternalDate(newDate);
        }
    };

    // Custom modifiers to style the range
    const modifiers = {
        range_start: date?.from,
        range_end: date?.to,
        range_middle: date?.from && date?.to ? { after: date.from, before: date.to } : undefined,
    };

    // Custom styles for the modifiers
    const modifiersStyles = {
        range_start: {
            backgroundColor: 'transparent',
            color: 'inherit',
            border: 'none',
        },
        range_end: {
            backgroundColor: 'transparent',
            color: 'inherit',
            border: 'none',
        },
        range_middle: {
            backgroundColor: '#f3f4f6', // gray-100
            color: 'inherit',
            borderRadius: '0',
        },
    };

    return (
        <Field className={cn("w-full", className)}>
            {label && <FieldLabel htmlFor="date-picker-range">{label}</FieldLabel>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-picker-range"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date?.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from || new Date()}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        disabled={disabledDays}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        classNames={{
                            day_range_start: '!bg-transparent !text-foreground',
                            day_range_end: '!bg-transparent !text-foreground',
                            day_range_middle: '!bg-gray-100 !text-foreground rounded-none',
                            day_selected: '!bg-primary !text-primary-foreground',
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}