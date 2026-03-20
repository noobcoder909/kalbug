"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Utensils, Bus, Gamepad2, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

const transactions = [
  {
    id: 1,
    name: "Grocery Store",
    category: "Food",
    amount: -45.50,
    date: "Today",
    icon: ShoppingBag,
    iconBg: "bg-chart-1",
  },
  {
    id: 2,
    name: "Bus Pass",
    category: "Transport",
    amount: -25.00,
    date: "Today",
    icon: Bus,
    iconBg: "bg-chart-2",
  },
  {
    id: 3,
    name: "Restaurant",
    category: "Food",
    amount: -32.80,
    date: "Yesterday",
    icon: Utensils,
    iconBg: "bg-chart-1",
  },
  {
    id: 4,
    name: "Gaming Subscription",
    category: "Entertainment",
    amount: -14.99,
    date: "Yesterday",
    icon: Gamepad2,
    iconBg: "bg-chart-3",
  },
  {
    id: 5,
    name: "Coffee Shop",
    category: "Food",
    amount: -5.25,
    date: "Mar 18",
    icon: Coffee,
    iconBg: "bg-chart-4",
  },
]

export function RecentTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Your latest spending</p>
        </div>
        <a
          href="/expenses"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </a>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", transaction.iconBg)}>
                <transaction.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-destructive">
                ₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
