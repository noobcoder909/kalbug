"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useAuth } from "@/lib/useAuth"
import {
  getExpenses,
  addExpense as blAddExpense,
  deleteExpense as blDeleteExpense,
  getTransactions,
  addTransaction as blAddTransaction,
  getUserSettings,
  saveUserSettings,
} from "@/lib/backendless"

export type Expense = {
  id: number
  objectId?: string
  name: string
  amount: number
  category: string
  date: string
}

export type Transaction = {
  id: string
  objectId?: string
  amount: number
  description: string
  type: "deposit" | "expense"
  date: string
}

interface ExpensesContextType {
  expenses: Expense[]
  addExpense: (expense: any) => void
  deleteExpense: (id: number) => void
  transactions: Transaction[]
  currentBalance: number
  totalDeposits: number
  totalExpenses: number
  monthlyBudget: number
  savingsGoal: number
  updateMonthlyBudget: (val: number) => void
  updateSavingsGoal: (val: number) => void
  loading: boolean
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyBudget, setMonthlyBudget] = useState(1500)
  const [savingsGoal, setSavingsGoal] = useState(200)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setExpenses([])
      setTransactions([])
      setLoading(false)
      return
    }
    loadAllData()
  }, [user])

  const loadAllData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const [expData, txData, settings] = await Promise.all([
        getExpenses(user.uid),
        getTransactions(user.uid),
        getUserSettings(user.uid),
      ])

      const mappedExpenses: Expense[] = (expData || []).map((e: any) => ({
        id: e.objectId,
        objectId: e.objectId,
        name: e.expense_name,
        amount: e.amount,
        category: e.category,
        date: e.expense_date,
      }))

      const mappedTx: Transaction[] = (txData || []).map((t: any) => ({
        id: t.objectId,
        objectId: t.objectId,
        amount: t.amount,
        description: t.description,
        type: t.type,
        date: t.transaction_date,
      }))

      setExpenses(mappedExpenses)
      setTransactions(mappedTx)

      if (settings) {
        setMonthlyBudget(settings.monthly_budget || 1500)
        setSavingsGoal(settings.savings_goal || 200)
      }
    } catch (err) {
      console.error("Failed to load data from Backendless:", err)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (newEntry: any) => {
    if (!user) return

    if ("description" in newEntry) {
      const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
      try {
        const saved = await blAddTransaction({
          user_id: user.uid,
          amount: newEntry.amount,
          description: newEntry.description,
          type: newEntry.type,
          transaction_date: today,
        })
        const tx: Transaction = {
          id: saved.objectId,
          objectId: saved.objectId,
          amount: newEntry.amount,
          description: newEntry.description,
          type: newEntry.type,
          date: today,
        }
        setTransactions((prev) => [tx, ...prev])

        if (newEntry.type === "expense") {
          const savedExp = await blAddExpense({
            user_id: user.uid,
            expense_name: newEntry.description,
            amount: newEntry.amount,
            category: "Other",
            expense_date: new Date().toISOString().split("T")[0],
          })
          const exp: Expense = {
            id: savedExp.objectId,
            objectId: savedExp.objectId,
            name: newEntry.description,
            amount: newEntry.amount,
            category: "Other",
            date: new Date().toISOString().split("T")[0],
          }
          setExpenses((prev) => [exp, ...prev])
        }
      } catch (err) {
        console.error("Failed to add transaction:", err)
      }
    } else {
      try {
        const saved = await blAddExpense({
          user_id: user.uid,
          expense_name: newEntry.name,
          amount: newEntry.amount,
          category: newEntry.category,
          expense_date: newEntry.date,
        })
        const exp: Expense = {
          id: saved.objectId,
          objectId: saved.objectId,
          name: newEntry.name,
          amount: newEntry.amount,
          category: newEntry.category,
          date: newEntry.date,
        }
        setExpenses((prev) => [exp, ...prev])

        const today = new Date().toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
        const savedTx = await blAddTransaction({
          user_id: user.uid,
          amount: newEntry.amount,
          description: newEntry.name,
          type: "expense",
          transaction_date: today,
        })
        const tx: Transaction = {
          id: savedTx.objectId,
          objectId: savedTx.objectId,
          amount: newEntry.amount,
          description: newEntry.name,
          type: "expense",
          date: today,
        }
        setTransactions((prev) => [tx, ...prev])
      } catch (err) {
        console.error("Failed to add expense:", err)
      }
    }
  }

  const deleteExpense = async (id: number) => {
    const exp = expenses.find(
      (e) => e.id === id || e.objectId === String(id)
    )
    if (!exp?.objectId) return
    try {
      await blDeleteExpense(exp.objectId)
      setExpenses((prev) =>
        prev.filter((e) => e.id !== id && e.objectId !== String(id))
      )
    } catch (err) {
      console.error("Failed to delete expense:", err)
    }
  }

  const updateMonthlyBudget = async (val: number) => {
    setMonthlyBudget(val)
    if (!user) return
    try {
      await saveUserSettings({
        user_id: user.uid,
        monthly_budget: val,
        savings_goal: savingsGoal,
      })
    } catch (err) {
      console.error("Failed to save budget:", err)
    }
  }

  const updateSavingsGoal = async (val: number) => {
    setSavingsGoal(val)
    if (!user) return
    try {
      await saveUserSettings({
        user_id: user.uid,
        monthly_budget: monthlyBudget,
        savings_goal: val,
      })
    } catch (err) {
      console.error("Failed to save savings goal:", err)
    }
  }

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0)

  const totalExpensesFromTx = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)

  const currentBalance = totalDeposits - totalExpensesFromTx

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        transactions,
        currentBalance,
        totalDeposits,
        totalExpenses: totalExpensesFromTx,
        monthlyBudget,
        savingsGoal,
        updateMonthlyBudget,
        updateSavingsGoal,
        loading,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => {
  const context = useContext(ExpensesContext)
  if (!context) throw new Error("useExpenses must be used within ExpensesProvider")
  return context
}