"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import { useExpenses } from "@/lib/expenses-context"
import { Loader2 } from "lucide-react"

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function parseExpenseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Try ISO format: "2024-01-15"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) return d
  }

  // Try "15 Jan 2024" or "15 Jan 24" (Backendless en-IN format)
  const match = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2,4})$/)
  if (match) {
    const day = parseInt(match[1])
    const monthIdx = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase() === match[2].toLowerCase()
    )
    let year = parseInt(match[3])
    if (year < 100) year += 2000
    if (monthIdx !== -1) {
      return new Date(year, monthIdx, day)
    }
  }

  // Try "Jan 15, 2024"
  const d2 = new Date(dateStr)
  if (!isNaN(d2.getTime())) return d2

  return null
}

export function ExpenseChart() {
  const { expenses, loading } = useExpenses()

  // Group by month
  const monthMap: Record<string, number> = {}
  expenses.forEach((e) => {
    const date = parseExpenseDate(e.date)
    if (!date) return
    const key = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
    monthMap[key] = (monthMap[key] || 0) + e.amount
  })

  // Sort chronologically
  const data = Object.entries(monthMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => {
      const parse = (s: string) => {
        const [mon, yr] = s.split(" ")
        return parseInt(yr) * 12 + MONTH_NAMES.indexOf(mon)
      }
      return parse(a.name) - parse(b.name)
    })

  const maxVal = Math.max(...data.map((d) => d.total), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="glass rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Monthly Spending</h3>
        <p className="text-sm text-muted-foreground">Expenses grouped by month</p>
      </div>

      {loading ? (
        <div className="h-[260px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[260px] flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm text-muted-foreground">
            No expenses yet.<br />Add some to see your monthly spending.
          </p>
        </div>
      ) : (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              barSize={32}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.01 260)"
                vertical={false}
              />
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
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.01 260)",
                  border: "1px solid oklch(0.22 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, "Spent"]}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.total === maxVal
                        ? "oklch(0.55 0.22 25)"
                        : "oklch(0.65 0.2 160)"
                    }
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.length > 0 && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: "oklch(0.65 0.2 160)" }}
            />
            Normal month
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: "oklch(0.55 0.22 25)" }}
            />
            Highest spending
          </div>
        </div>
      )}
    </motion.div>
  )
}