import { Card } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default function DailyTip() {
  const tips = [
    "Master the two-pointer technique for solving array problems efficiently.",
    "Always consider edge cases: empty inputs, single elements, and duplicates.",
    "Practice explaining your thought process out loud - it helps catch logical gaps.",
    "Use a whiteboard to visualize data structures before coding.",
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  return (
    <Card className="p-6 border-primary/40 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12"></div>
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
          <Lightbulb size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold mb-2">Daily Interview Tip</h3>
          <p className="text-foreground/80 leading-relaxed">{randomTip}</p>
        </div>
      </div>
    </Card>
  )
}
