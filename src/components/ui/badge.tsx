import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shrink-0",
  {
    variants: {
      variant: {
        pro:      "bg-pink text-top",
        free:     "bg-low text-high",
        active:   "bg-green text-top",
        inactive: "bg-low text-mid",
        new:      "bg-blue text-top",
      },
    },
    defaultVariants: { variant: "free" },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
