interface ProgressBarProps {
  percentage: number
  label?: string
}

export default function ProgressBar({ percentage, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {label && <p className="text-xs text-foreground/60 mt-2">{label}</p>}
    </div>
  )
}
