"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
};

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: number) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from localStorage
  useEffect(() => {
    const data = localStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = { ...newExpense, id: Date.now() };
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error("useExpenses must be used within ExpensesProvider");
  return context;
};

