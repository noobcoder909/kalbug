"use client"

import { motion } from "framer-motion"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useExpenses } from "@/lib/expenses-context"

const CATEGORY_COLORS: Record<string, string> = {
  Food:          "oklch(0.65 0.2 160)",
  Transport:     "oklch(0.55 0.18 200)",
  Entertainment: "oklch(0.7 0.15 80)",
  Shopping:      "oklch(0.6 0.2 300)",
  Utilities:     "oklch(0.55 0.22 25)",
  Health:        "oklch(0.65 0.18 140)",
  Education:     "oklch(0.6 0.2 240)",
  Friends:       "oklch(0.65 0.2 60)",
  Other:         "oklch(0.5 0.05 260)",
}

const FALLBACK_COLORS = [
  "oklch(0.65 0.2 160)",
  "oklch(0.55 0.18 200)",
  "oklch(0.7 0.15 80)",
  "oklch(0.6 0.2 300)",
  "oklch(0.55 0.22 25)",
  "oklch(0.65 0.18 140)",
  "oklch(0.6 0.2 240)",
  "oklch(0.65 0.2 60)",
]

export function CategoryChart() {
  const { expenses } = useExpenses()

  // Group by category
  const categoryMap: Record<string, number> = {}
  expenses.forEach((e) => {
    const cat = e.category || "Other"
    categoryMap[cat] = (categoryMap[cat] || 0) + e.amount
  })

  const data = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="glass rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Expenses by Category</h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          No expense data yet. Add some expenses to see your category breakdown.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.12 0.01 260)",
                    border: "1px solid oklch(0.22 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3 w-full">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">₹{item.value.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
