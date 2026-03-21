"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, PiggyBank, Target, Pencil, Check } from "lucide-react";
import { ExpenseChart } from "./expense-chart";
import { CategoryChart } from "./category-chart";
import { useState, useEffect, useRef } from "react";
import { useExpenses } from "@/lib/expenses-context";

export default function DashboardPage() {
  const {
    expenses,
    monthlyBudget,
    savingsGoal,
    updateMonthlyBudget,
    updateSavingsGoal,
  } = useExpenses();

  const [editingBudget, setEditingBudget] = useState(false);
  const [editingSavings, setEditingSavings] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [savingsInput, setSavingsInput] = useState("");
  const budgetRef = useRef<HTMLInputElement>(null);
  const savingsRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setBudgetInput(monthlyBudget.toString()); }, [monthlyBudget]);
  useEffect(() => { setSavingsInput(savingsGoal.toString()); }, [savingsGoal]);
  useEffect(() => {
    if (editingBudget && budgetRef.current) {
      budgetRef.current.focus();
      budgetRef.current.select();
    }
  }, [editingBudget]);
  useEffect(() => {
    if (editingSavings && savingsRef.current) {
      savingsRef.current.focus();
      savingsRef.current.select();
    }
  }, [editingSavings]);

  const saveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) updateMonthlyBudget(val);
    setEditingBudget(false);
  };

  const saveSavings = () => {
    const val = parseFloat(savingsInput);
    if (!isNaN(val) && val >= 0) updateSavingsGoal(val);
    setEditingSavings(false);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remaining = monthlyBudget - totalExpenses;

  const getSavingsStatus = () => {
    if (monthlyBudget <= 0) return null;
    const budgetUsedPct = (totalExpenses / monthlyBudget) * 100;
    const potentialSavings = monthlyBudget - totalExpenses;

    if (totalExpenses > monthlyBudget) {
      return {
        message: "Bruh! Everything okay? What's all this expenses for 😅",
        color: "text-red-500",
        bg: "bg-red-500/10 border-red-500/30",
        iconColor: "bg-red-500",
      };
    }
    if (potentialSavings < savingsGoal && savingsGoal > 0) {
      if (budgetUsedPct >= 80) {
        return {
          message: "Tough month, huh! 😬 Savings goal looks tricky this month.",
          color: "text-orange-400",
          bg: "bg-orange-500/10 border-orange-500/30",
          iconColor: "bg-orange-500",
        };
      }
      return {
        message: "You have to control your expenses! 🟠 Savings goal at risk.",
        color: "text-orange-400",
        bg: "bg-orange-500/10 border-orange-500/30",
        iconColor: "bg-orange-500",
      };
    }
    if (potentialSavings >= savingsGoal && budgetUsedPct < 60) {
      return {
        message: "You are spending smartly! 🎉 On track to hit your savings goal.",
        color: "text-success",
        bg: "bg-success/10 border-success/30",
        iconColor: "bg-success",
      };
    }
    return null;
  };

  const savingsStatus = getSavingsStatus();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Track your budget, expenses, and savings</p>
      </motion.div>

      {savingsStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl px-5 py-3 border text-sm font-medium ${savingsStatus.bg} ${savingsStatus.color}`}
        >
          {savingsStatus.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Monthly Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">Monthly Budget</p>
              {editingBudget ? (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg font-bold text-foreground">₹</span>
                  <input
                    ref={budgetRef}
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onBlur={saveBudget}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveBudget();
                      if (e.key === "Escape") setEditingBudget(false);
                    }}
                    className="w-full text-xl font-bold text-foreground rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-secondary border border-border"
                  />
                  <button
                    onMouseDown={(e) => { e.preventDefault(); saveBudget(); }}
                    className="p-1 rounded-md hover:bg-primary/20 text-primary shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{monthlyBudget.toLocaleString()}
                </p>
              )}
              {!editingBudget && (
                <button
                  onClick={() => setEditingBudget(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded-md hover:bg-primary/10 transition-colors border border-primary/20"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
            <div className="p-3 rounded-lg shrink-0 bg-primary">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ₹{totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-destructive mt-2">Live data</p>
            </div>
            <div className="p-3 rounded-lg shrink-0 bg-chart-5">
              <TrendingDown className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className={`text-2xl font-bold mt-1 ${remaining < 0 ? "text-destructive" : "text-foreground"}`}>
                ₹{remaining.toLocaleString()}
              </p>
              <p className="text-xs text-success mt-2">
                {monthlyBudget > 0
                  ? ((remaining / monthlyBudget) * 100).toFixed(1)
                  : 0}% of budget left
              </p>
            </div>
            <div className="p-3 rounded-lg shrink-0 bg-chart-1">
              <PiggyBank className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Savings Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className={`glass rounded-xl p-6 transition-all ${
            savingsStatus?.color === "text-orange-400"
              ? "border-orange-500/40"
              : savingsStatus?.color === "text-red-500"
              ? "border-red-500/40"
              : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">Savings Goal</p>
              {editingSavings ? (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg font-bold text-foreground">₹</span>
                  <input
                    ref={savingsRef}
                    type="number"
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(e.target.value)}
                    onBlur={saveSavings}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveSavings();
                      if (e.key === "Escape") setEditingSavings(false);
                    }}
                    className="w-full text-xl font-bold text-foreground rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary bg-secondary border border-border"
                  />
                  <button
                    onMouseDown={(e) => { e.preventDefault(); saveSavings(); }}
                    className="p-1 rounded-md hover:bg-primary/20 text-primary shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className={`text-2xl font-bold mt-1 ${
                  savingsStatus?.color === "text-orange-400"
                    ? "text-orange-400"
                    : savingsStatus?.color === "text-red-500"
                    ? "text-red-500"
                    : "text-foreground"
                }`}>
                  ₹{savingsGoal.toLocaleString()}
                </p>
              )}
              {!editingSavings && (
                <button
                  onClick={() => setEditingSavings(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded-md hover:bg-primary/10 transition-colors border border-primary/20"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
            <div className={`p-3 rounded-lg shrink-0 ${
              savingsStatus?.color === "text-orange-400"
                ? "bg-orange-500"
                : savingsStatus?.color === "text-red-500"
                ? "bg-red-500"
                : "bg-chart-2"
            }`}>
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <CategoryChart />
      </div>
    </div>
  );
}