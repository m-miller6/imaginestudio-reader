import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tap-highlight-none touch-target active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 active:bg-primary/80 shadow-soft hover:shadow-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:bg-destructive/80",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:scale-105 active:bg-secondary/80 shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
        whimsical: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-110 active:scale-105 shadow-magical animate-bounce-gentle",
        magic: "bg-magic-purple text-white hover:scale-105 active:scale-100 shadow-magical border-2 border-white/20",
        adventure: "bg-magic-orange text-white hover:scale-105 active:scale-100 shadow-hover font-bold",
        success: "bg-magic-green text-white hover:scale-105 active:scale-100 shadow-soft",
      },
      size: {
        default: "h-12 px-6 py-3 text-base min-h-[44px]",
        sm: "h-10 rounded-lg px-4 text-sm min-h-[40px]",
        lg: "h-14 rounded-xl px-8 text-lg font-bold min-h-[48px]",
        icon: "h-12 w-12 min-h-[44px] min-w-[44px]",
        xl: "h-16 rounded-2xl px-10 text-xl font-bold min-h-[56px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
