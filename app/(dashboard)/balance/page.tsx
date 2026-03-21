"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useExpenses } from "@/lib/expenses-context";

export default function BalancePage() {
  const { transactions, addExpense, currentBalance, totalDeposits, totalExpenses } = useExpenses();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"deposit" | "expense">("deposit");

  const handleAddTransaction = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    addExpense({
      amount: amountNum,
      description: description || (transactionType === "deposit" ? "Added funds" : "Expense"),
      type: transactionType,
    });

    setAmount("");
    setDescription("");
    setDialogOpen(false);
  };

  // Generate balance history from transactions
  const balanceHistory = transactions
    .slice()
    .reverse()
    .reduce<{ date: string; balance: number; deposits: number; spending: number }[]>((acc, t) => {
      const prevBalance = acc.length ? acc[acc.length - 1].balance : 0;
      const newBalance = t.type === "deposit" ? prevBalance + t.amount : prevBalance - t.amount;
      acc.push({
        date: t.date,
        balance: newBalance,
        deposits: t.type === "deposit" ? t.amount : 0,
        spending: t.type === "expense" ? t.amount : 0,
      });
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Balance</h1>
          <p className="text-muted-foreground">Track your account balance and transactions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Transaction</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add money to your account or record an expense.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                  className="w-full p-2 rounded border bg-secondary text-foreground"
                >
                  <option value="deposit">Deposit (Add Money)</option>
                  <option value="expense">Expense (Deduct)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTransaction}>
                {transactionType === "deposit" ? "Add Money" : "Record Expense"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    ₹{currentBalance.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Live balance
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <IndianRupee className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-3xl font-bold text-emerald-500 mt-1">₹{totalDeposits.toLocaleString()}</p>
                  <p className="text-sm text-emerald-500/80 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Money added
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-rose-500 mt-1">₹{totalExpenses.toLocaleString()}</p>
                  <p className="text-sm text-rose-500/80 mt-2 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" /> Money spent
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Balance History Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your balance over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceHistory}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number, name: string) => [`₹${value.toLocaleString()}`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#balanceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {transactions.slice(0, 6).map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "deposit" ? "bg-emerald-500/20" : "bg-rose-500/20"
                      }`}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${transaction.type === "deposit" ? "text-emerald-500" : "text-rose-500"}`}>
                    {transaction.type === "deposit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
