"use client";

import { motion } from "framer-motion";
import { useExpenses } from "@/lib/expenses-context";

export const ExpenseChart = () => {
  const { expenses } = useExpenses();

  // Simple total per category (example)
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <motion.div
      className="bg-card p-4 rounded-lg shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-bold mb-2">Expense Chart (placeholder)</h2>
      <ul className="text-sm text-muted-foreground">
        {Object.entries(categoryTotals).map(([cat, total]) => (
          <li key={cat}>
            {cat}: ₹{total.toFixed(2)}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
