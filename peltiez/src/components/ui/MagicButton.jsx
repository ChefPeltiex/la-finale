import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const MagicButton = React.forwardRef(({ className, variant = "magic", size = "default", asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  const variants = {
    magic: "btn-magic rounded-xl font-bold",
    glow: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold glow-green hover-lift shadow-magic",
    soft: "glass rounded-xl font-medium text-foreground hover:bg-white/15 transition-all",
    ethereal: "bg-transparent border-2 border-emerald-400/50 text-emerald-300 rounded-xl font-bold hover:border-emerald-300 hover:bg-emerald-500/10 transition-all",
  }

  const sizes = {
    default: "h-10 px-5 py-2 text-sm",
    sm: "h-8 px-3 text-xs rounded-lg",
    lg: "h-12 px-8 text-base rounded-2xl",
    icon: "h-10 w-10",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
MagicButton.displayName = "MagicButton"

export { MagicButton }