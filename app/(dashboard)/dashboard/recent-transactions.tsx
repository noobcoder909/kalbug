"use client";

import React from "react";
import { IndianRupee } from "lucide-react";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

interface Props {
  expenses: Expense[];
}

export const RecentTransactions: React.FC<Props> = ({ expenses }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Recent Transactions</h2>

      {expenses.length === 0 ? (
        <p className="text-muted-foreground">No expenses yet</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {expenses
            .slice()
            .reverse()
            .map((e) => (
              <li key={e.id} className="flex justify-between py-2">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.category}</p>
                </div>
                <div className="flex items-center gap-1 text-right">
                  <IndianRupee size={16} />
                  <span className="font-semibold">{e.amount}</span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
