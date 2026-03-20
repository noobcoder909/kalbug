"use client"

import { motion } from "framer-motion"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Food", value: 320, color: "oklch(0.65 0.2 160)" },
  { name: "Transport", value: 180, color: "oklch(0.55 0.18 200)" },
  { name: "Entertainment", value: 150, color: "oklch(0.7 0.15 80)" },
  { name: "Shopping", value: 220, color: "oklch(0.6 0.2 300)" },
  { name: "Other", value: 80, color: "oklch(0.55 0.22 25)" },
]

export function CategoryChart() {
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
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="h-[200px] w-[200px]">
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
                formatter={(value: number) => [`₹${value}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">₹{item.value}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
