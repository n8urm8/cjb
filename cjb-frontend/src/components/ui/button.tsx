import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "shadow-xs transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-light)] disabled:opacity-50"
          + " "
          + "bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--color-primary-light)]",
        destructive:
          "shadow-xs transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400 disabled:opacity-50"
          + " "
          + "bg-red-600 text-[var(--color-white)] hover:bg-red-700",
        outline:
          "border shadow-xs transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-light)] disabled:opacity-50"
          + " "
          + "border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary-light)] hover:text-[var(--color-black)]",
        secondary:
          "shadow-xs transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-secondary)] disabled:opacity-50"
          + " "
          + "bg-[var(--color-secondary)] text-[var(--color-black)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-black)]",
        ghost:
          "transition hover:bg-[var(--color-primary-light)] hover:text-[var(--color-black)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
