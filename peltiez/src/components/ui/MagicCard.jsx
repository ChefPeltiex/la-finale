import React from "react"
import { cn } from "@/lib/utils"

const MagicCard = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-card rounded-2xl border border-border glass card-magic hover-lift transition-all duration-300",
    elevated: "card-elevated rounded-2xl glass border border-emerald-400/10 shadow-magic hover-lift transition-all duration-300",
    glow: "rounded-2xl border border-emerald-400/30 glass glow-green bg-emerald-500/5 hover-lift transition-all duration-300",
    minimal: "rounded-2xl border border-border/50 bg-transparent backdrop-blur-sm hover-lift transition-all duration-300",
  }

  return (
    <div
      className={cn(variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})
MagicCard.displayName = "MagicCard"

export { MagicCard }