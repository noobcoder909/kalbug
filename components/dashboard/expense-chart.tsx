"use client"

import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { name: "Jan", expenses: 420 },
  { name: "Feb", expenses: 380 },
  { name: "Mar", expenses: 520 },
  { name: "Apr", expenses: 450 },
  { name: "May", expenses: 390 },
  { name: "Jun", expenses: 480 },
]

export function ExpenseChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Spending Overview</h3>
          <p className="text-sm text-muted-foreground">Your expenses over time</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.01 260)",
                border: "1px solid oklch(0.22 0.01 260)",
                borderRadius: "8px",
                color: "oklch(0.95 0 0)",
              }}
              formatter={(value: number) => [`₹${value}`, "Expenses"]}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="oklch(0.65 0.2 160)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
