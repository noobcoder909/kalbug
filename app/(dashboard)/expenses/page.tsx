"use client";

import { motion } from "framer-motion";
import { useExpenses } from "@/lib/expenses-context";
import { AddExpenseForm } from "@/components/expenses/add-expense-form";
import { ExpenseTable } from "@/components/expenses/expense-table";

export default function ExpensesPage() {
  // Get shared expenses and functions from context
  const { expenses, addExpense, deleteExpense } = useExpenses();

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">Manage and track your expenses</p>
        </div>
        <div className="glass rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold text-foreground">₹{totalExpenses.toFixed(2)}</p>
        </div>
      </motion.div>

      {/* Add Expense Form */}
      <AddExpenseForm onAdd={addExpense} />

      {/* Expense Table */}
      <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}

