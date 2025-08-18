import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tap-highlight-none touch-target",
  {
    variants: {
      variant: {
        default: "btn-primary-montessori",
        destructive: "btn-montessori bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "btn-secondary-montessori border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5",
        secondary: "btn-secondary-montessori",
        ghost: "rounded-2xl px-4 py-2 hover:bg-muted hover:text-foreground transition-all duration-200 transform hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline font-medium transition-colors duration-200",
        accent: "btn-accent-montessori",
        playful: "btn-montessori bg-cheerful-blue text-white hover:bg-cheerful-blue/90 font-playful",
        warm: "btn-montessori bg-gradient-to-r from-hero-from to-hero-to text-white hover:shadow-elevated",
        whimsical: "btn-montessori bg-gradient-to-r from-primary to-accent text-white hover:shadow-elevated font-playful animate-gentle-float",
        adventure: "btn-accent-montessori"
      },
      size: {
        default: "h-11 px-6 py-3 text-sm rounded-2xl",
        sm: "h-9 px-4 py-2 text-sm rounded-xl",
        lg: "h-13 px-8 py-4 text-base rounded-2xl",
        icon: "h-11 w-11 rounded-2xl",
        xl: "h-15 px-10 py-5 text-lg rounded-3xl"
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
