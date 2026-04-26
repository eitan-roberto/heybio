import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Spinner() {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

const buttonVariants = cva(
  "inline-flex items-center font-semibold justify-center gap-2 whitespace-nowrap rounded-full transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        // primary
        default: "bg-top text-bottom hover:bg-high",
        solid:   "bg-top text-bottom hover:bg-high",
        // secondary
        outline: "border-2 border-top text-top hover:bg-top hover:text-bottom",
        // tertiary
        ghost: "text-high hover:bg-low hover:text-top",
        // positive
        success: "bg-green text-top hover:bg-green/80",
        // negative
        danger: "bg-orange/10 text-orange border border-orange hover:bg-orange hover:text-top",
        // compat
        destructive: "bg-orange text-bottom hover:bg-orange/80",
        secondary: "bg-low text-high hover:bg-low/80",
        link: "underline-offset-4 hover:underline text-top",
      },
      size: {
        default: "h-10 px-5 text-sm",
        xs:  "h-7 px-3 text-xs gap-1",
        sm:  "h-9 px-4 text-sm",
        md:  "h-11 px-6 text-base",
        lg:  "h-14 px-8 text-base",
        icon:    "h-10 w-10",
        "icon-xs": "h-7 w-7",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
