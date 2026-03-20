"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AddExpenseForm } from "@/components/expenses/add-expense-form"
import { ExpenseTable, Expense } from "@/components/expenses/expense-table"

const initialExpenses: Expense[] = [
  { id: 1, name: "Grocery Store", amount: 45.50, category: "Food", date: "2024-03-20" },
  { id: 2, name: "Bus Pass", amount: 25.00, category: "Transport", date: "2024-03-20" },
  { id: 3, name: "Restaurant Dinner", amount: 32.80, category: "Food", date: "2024-03-19" },
  { id: 4, name: "Gaming Subscription", amount: 14.99, category: "Entertainment", date: "2024-03-19" },
  { id: 5, name: "Coffee Shop", amount: 5.25, category: "Food", date: "2024-03-18" },
  { id: 6, name: "Electric Bill", amount: 85.00, category: "Utilities", date: "2024-03-15" },
  { id: 7, name: "New Shoes", amount: 120.00, category: "Shopping", date: "2024-03-14" },
  { id: 8, name: "Gym Membership", amount: 30.00, category: "Health", date: "2024-03-10" },
  { id: 9, name: "Online Course", amount: 49.99, category: "Education", date: "2024-03-08" },
  { id: 10, name: "Movie Tickets", amount: 24.00, category: "Entertainment", date: "2024-03-05" },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now(),
    }
    setExpenses((prev) => [expense, ...prev])
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

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
      <AddExpenseForm onAdd={handleAddExpense} />

      {/* Expense Table */}
      <ExpenseTable expenses={expenses} onDelete={handleDeleteExpense} />
    </div>
  )
}
