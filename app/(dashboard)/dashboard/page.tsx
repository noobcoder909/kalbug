"use client";

import { motion } from "framer-motion"
import { Wallet, TrendingDown, PiggyBank, Target, TrendingUp } from "lucide-react"
import { BudgetCard } from "@/components/dashboard/budget-card"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Track your budget and expenses</p>
      </motion.div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetCard
          title="Monthly Budget"
          value="₹1,500.00"
          change="Set for March 2024"
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-primary"
        />
        <BudgetCard
          title="Total Expenses"
          value="₹948.54"
          change="+12% from last month"
          changeType="negative"
          icon={TrendingDown}
          iconColor="bg-chart-5"
        />
        <BudgetCard
          title="Remaining"
          value="₹551.46"
          change="36.8% of budget left"
          changeType="positive"
          icon={PiggyBank}
          iconColor="bg-chart-1"
        />
        <BudgetCard
          title="Savings Goal"
          value="₹200.00"
          change="₹150 saved this month"
          changeType="positive"
          icon={Target}
          iconColor="bg-chart-2"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <CategoryChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}
