"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, PiggyBank, Target } from "lucide-react";
import { BudgetCard } from "@/components/dashboard/budget-card";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { useState, useEffect } from "react";
import { useExpenses } from "@/lib/expenses-context";

export default function DashboardPage() {
  const { transactions = [], monthlyBudget: contextBudget = 1500, savingsGoal: contextSavings = 200, updateMonthlyBudget, updateSavingsGoal } =
    useExpenses();

  // Inline editing state
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingSavings, setEditingSavings] = useState(false);
  const [budgetInput, setBudgetInput] = useState(contextBudget?.toString() || "0");
  const [savingsInput, setSavingsInput] = useState(contextSavings?.toString() || "0");

  useEffect(() => setBudgetInput(contextBudget?.toString() || "0"), [contextBudget]);
  useEffect(() => setSavingsInput(contextSavings?.toString() || "0"), [contextSavings]);

  // Calculate totals
  const totalExpenses = (transactions || [])
    .filter((t) => t?.type === "expense")
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const remaining = (contextBudget || 0) - totalExpenses;

  // Save handlers
  const saveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val)) updateMonthlyBudget(val);
    setEditingBudget(false);
  };

  const saveSavings = () => {
    const val = parseFloat(savingsInput);
    if (!isNaN(val)) updateSavingsGoal(val);
    setEditingSavings(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Track your budget, expenses, and savings</p>
      </motion.div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetCard
          title="Monthly Budget"
          change={editingBudget ? "Press Enter to save" : "Click value to edit"}
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-primary"
        >
          {editingBudget ? (
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={saveBudget}
              onKeyDown={(e) => e.key === "Enter" && saveBudget()}
              className="w-full bg-secondary border border-input rounded px-2 py-1 text-foreground"
              autoFocus
            />
          ) : (
            <span onClick={() => setEditingBudget(true)} className="cursor-pointer">
              ₹{contextBudget?.toLocaleString()}
            </span>
          )}
        </BudgetCard>

        <BudgetCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          change="Live data"
          changeType="negative"
          icon={TrendingDown}
          iconColor="bg-chart-5"
        />

        <BudgetCard
          title="Remaining"
          value={`₹${remaining.toLocaleString()}`}
          change={`${((remaining / (contextBudget || 1)) * 100).toFixed(1)}% left`}
          changeType="positive"
          icon={PiggyBank}
          iconColor="bg-chart-1"
        />

        <BudgetCard
          title="Savings Goal"
          change={editingSavings ? "Press Enter to save" : "Click value to edit"}
          changeType="positive"
          icon={Target}
          iconColor="bg-chart-2"
        >
          {editingSavings ? (
            <input
              type="number"
              value={savingsInput}
              onChange={(e) => setSavingsInput(e.target.value)}
              onBlur={saveSavings}
              onKeyDown={(e) => e.key === "Enter" && saveSavings()}
              className="w-full bg-secondary border border-input rounded px-2 py-1 text-foreground"
              autoFocus
            />
          ) : (
            <span onClick={() => setEditingSavings(true)} className="cursor-pointer">
              ₹{contextSavings?.toLocaleString()}
            </span>
          )}
        </BudgetCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <CategoryChart />
      </div>
    </div>
  );
}
