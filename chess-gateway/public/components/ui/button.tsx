import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60",
        info: "bg-info text-white hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 dark:bg-info/60",
        warning:
          "bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "outline-destructive":
          "border border-destructive/50 bg-background text-destructive shadow-xs hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/20 dark:bg-input/30 dark:border-destructive/40 dark:hover:bg-destructive/20",
        "outline-info":
          "border border-info/50 bg-background text-info shadow-xs hover:bg-info/10 hover:text-info focus-visible:ring-info/20 dark:bg-input/30 dark:border-info/40 dark:hover:bg-info/20",
        "outline-success":
          "border border-success/50 bg-background text-success shadow-xs hover:bg-success/10 hover:text-success focus-visible:ring-success/20 dark:bg-input/30 dark:border-success/40 dark:hover:bg-success/20",
        "outline-warning":
          "border border-warning/50 bg-background text-warning shadow-xs hover:bg-warning/10 hover:text-warning focus-visible:ring-warning/20 dark:bg-input/30 dark:border-warning/40 dark:hover:bg-warning/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        "link-destructive":
          "text-destructive underline-offset-4 hover:underline",
        "link-success": "text-success underline-offset-4 hover:underline",
        "link-info": "text-info underline-offset-4 hover:underline",
        "link-warning": "text-warning underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  loading = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner /> : props.children}
    </Comp>
  )
}

export { Button, buttonVariants }
