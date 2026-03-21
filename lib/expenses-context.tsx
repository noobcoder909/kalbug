"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  type?: "expense";
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: "deposit" | "expense";
  date: string;
};

interface ExpensesContextType {
  // Expenses (for /expenses page)
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id"> | { amount: number; description: string; type: "deposit" | "expense" }) => void;
  deleteExpense: (id: number) => void;

  // Transactions (for /balance page)
  transactions: Transaction[];
  currentBalance: number;
  totalDeposits: number;
  totalExpenses: number;

  // Dashboard settings
  monthlyBudget: number;
  savingsGoal: number;
  updateMonthlyBudget: (val: number) => void;
  updateSavingsGoal: (val: number) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(1500);
  const [savingsGoal, setSavingsGoal] = useState(200);

  // Load from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    const savedBudget = localStorage.getItem("monthlyBudget");
    if (savedBudget) setMonthlyBudget(parseFloat(savedBudget));

    const savedSavings = localStorage.getItem("savingsGoal");
    if (savedSavings) setSavingsGoal(parseFloat(savedSavings));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addExpense = (newEntry: any) => {
    // Balance page passes { amount, description, type }
    if ("description" in newEntry) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: newEntry.amount,
        description: newEntry.description,
        type: newEntry.type,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      };
      setTransactions((prev) => [transaction, ...prev]);

      // Also add to expenses list if it's an expense
      if (newEntry.type === "expense") {
        const expense: Expense = {
          id: Date.now(),
          name: newEntry.description,
          amount: newEntry.amount,
          category: "Other",
          date: new Date().toISOString().split("T")[0],
        };
        setExpenses((prev) => [expense, ...prev]);
      }
    } else {
      // Expenses page passes { name, amount, category, date }
      const expense: Expense = { ...newEntry, id: Date.now() };
      setExpenses((prev) => [expense, ...prev]);

      // Also record as a transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: newEntry.amount,
        description: newEntry.name,
        type: "expense",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      };
      setTransactions((prev) => [transaction, ...prev]);
    }
  };

  // Friends page lent money adds as expense
  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateMonthlyBudget = (val: number) => {
    setMonthlyBudget(val);
    localStorage.setItem("monthlyBudget", val.toString());
  };

  const updateSavingsGoal = (val: number) => {
    setSavingsGoal(val);
    localStorage.setItem("savingsGoal", val.toString());
  };

  const totalDeposits = transactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesFromTx = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalDeposits - totalExpensesFromTx;

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
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error("useExpenses must be used within ExpensesProvider");
  return context;
};