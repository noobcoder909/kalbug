"use client"

import { motion } from "framer-motion"
import { useExpenses } from "@/lib/expenses-context"
import { Loader2 } from "lucide-react"

const CATEGORY_CONFIG: Record<string, { color: string; emoji: string }> = {
  Food:          { color: "#00c878", emoji: "🍔" },
  Transport:     { color: "#3b82f6", emoji: "🚌" },
  Entertainment: { color: "#f59e0b", emoji: "🎮" },
  Shopping:      { color: "#a855f7", emoji: "🛍️" },
  Utilities:     { color: "#ef4444", emoji: "⚡" },
  Health:        { color: "#06b6d4", emoji: "💊" },
  Education:     { color: "#8b5cf6", emoji: "📚" },
  Friends:       { color: "#f97316", emoji: "👥" },
  Other:         { color: "#6b7280", emoji: "📦" },
}

const FALLBACK_COLORS = [
  "#00c878", "#3b82f6", "#f59e0b", "#a855f7",
  "#ef4444", "#06b6d4", "#8b5cf6", "#f97316",
]

export function CategoryChart() {
  const { expenses, loading } = useExpenses()

  const categoryMap: Record<string, number> = {}
  expenses.forEach((e) => {
    const cat = e.category || "Other"
    categoryMap[cat] = (categoryMap[cat] || 0) + e.amount
  })

  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0)

  const data = Object.entries(categoryMap)
    .map(([name, value], i) => ({
      name,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
      color: CATEGORY_CONFIG[name]?.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      emoji: CATEGORY_CONFIG[name]?.emoji || "📦",
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="glass rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Spending by Category</h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      {loading ? (
        <div className="h-[260px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[260px] flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🗂️</span>
          </div>
          <p className="text-sm text-muted-foreground">No categories yet.<br />Add expenses to see the breakdown.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    ₹{item.value.toLocaleString()}
                  </span>
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-md min-w-[38px] text-center"
                    style={{ background: `${item.color}20`, color: item.color }}
                  >
                    {item.pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}

          {/* Total */}
          <div className="pt-3 mt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total spent</span>
            <span className="text-sm font-bold text-foreground">₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}