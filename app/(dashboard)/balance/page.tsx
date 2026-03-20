"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, TrendingUp, TrendingDown, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock data for balance history
const initialBalanceHistory = [
  { date: "Mar 1", balance: 15000, deposits: 15000, spending: 0 },
  { date: "Mar 5", balance: 14200, deposits: 0, spending: 800 },
  { date: "Mar 8", balance: 13500, deposits: 0, spending: 700 },
  { date: "Mar 10", balance: 18500, deposits: 5000, spending: 0 },
  { date: "Mar 12", balance: 17800, deposits: 0, spending: 700 },
  { date: "Mar 15", balance: 17100, deposits: 0, spending: 700 },
  { date: "Mar 18", balance: 16500, deposits: 0, spending: 600 },
  { date: "Mar 20", balance: 15800, deposits: 0, spending: 700 },
]

// Mock transactions
const initialTransactions = [
  { id: 1, type: "deposit", amount: 15000, description: "Initial deposit", date: "Mar 1" },
  { id: 2, type: "expense", amount: 800, description: "Groceries", date: "Mar 5" },
  { id: 3, type: "expense", amount: 700, description: "Transport", date: "Mar 8" },
  { id: 4, type: "deposit", amount: 5000, description: "Part-time job", date: "Mar 10" },
  { id: 5, type: "expense", amount: 700, description: "Food", date: "Mar 12" },
  { id: 6, type: "expense", amount: 700, description: "Entertainment", date: "Mar 15" },
  { id: 7, type: "expense", amount: 600, description: "Shopping", date: "Mar 18" },
  { id: 8, type: "expense", amount: 700, description: "Bills", date: "Mar 20" },
]

export default function BalancePage() {
  const [balanceHistory, setBalanceHistory] = useState(initialBalanceHistory)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [currentBalance, setCurrentBalance] = useState(15800)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transactionType, setTransactionType] = useState("deposit")

  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const handleAddMoney = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return

    const today = new Date()
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    
    const newTransaction = {
      id: transactions.length + 1,
      type: transactionType,
      amount: amountNum,
      description: description || (transactionType === "deposit" ? "Added funds" : "Expense"),
      date: dateStr,
    }

    const newBalance = transactionType === "deposit" 
      ? currentBalance + amountNum 
      : currentBalance - amountNum

    const newHistoryEntry = {
      date: dateStr,
      balance: newBalance,
      deposits: transactionType === "deposit" ? amountNum : 0,
      spending: transactionType === "expense" ? amountNum : 0,
    }

    setTransactions([...transactions, newTransaction])
    setBalanceHistory([...balanceHistory, newHistoryEntry])
    setCurrentBalance(newBalance)
    setAmount("")
    setDescription("")
    setDialogOpen(false)
  }

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
                <Label htmlFor="type" className="text-foreground">Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="bg-secondary border-input text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="deposit" className="text-foreground hover:bg-secondary cursor-pointer">
                      Deposit (Add Money)
                    </SelectItem>
                    <SelectItem value="expense" className="text-foreground hover:bg-secondary cursor-pointer">
                      Expense (Deduct)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-secondary border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Part-time job, Scholarship"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-secondary border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-input text-foreground hover:bg-secondary">
                Cancel
              </Button>
              <Button onClick={handleAddMoney} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {transactionType === "deposit" ? "Add Money" : "Record Expense"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-3xl font-bold text-foreground mt-1">₹{currentBalance.toLocaleString()}</p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-3xl font-bold text-emerald-500 mt-1">₹{totalDeposits.toLocaleString()}</p>
                  <p className="text-sm text-emerald-500/80 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    Money added
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-rose-500 mt-1">₹{totalExpenses.toLocaleString()}</p>
                  <p className="text-sm text-rose-500/80 mt-2 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" />
                    Money spent
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Balance History</CardTitle>
            <p className="text-sm text-muted-foreground">Track your balance over time based on deposits and spending</p>
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
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        balance: "Balance",
                        deposits: "Deposits",
                        spending: "Spending",
                      }
                      return [`₹${value.toLocaleString()}`, labels[name] || name]
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value) => {
                      const labels: Record<string, string> = {
                        balance: "Balance",
                        deposits: "Deposits",
                        spending: "Spending",
                      }
                      return <span style={{ color: "hsl(var(--foreground))" }}>{labels[value] || value}</span>
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {[...transactions].reverse().slice(0, 6).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "deposit" 
                          ? "bg-emerald-500/20" 
                          : "bg-rose-500/20"
                      }`}>
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
                    <p className={`text-sm font-semibold ${
                      transaction.type === "deposit" 
                        ? "text-emerald-500" 
                        : "text-rose-500"
                    }`}>
                      {transaction.type === "deposit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
