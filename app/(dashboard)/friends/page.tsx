"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, ArrowUpRight, ArrowDownLeft, Plus, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useExpenses } from "@/lib/expenses-context"

interface Friend {
  id: string
  name: string
  lent: number
  borrowed: number
}

interface FriendTransaction {
  id: string
  friendName: string
  type: "lent" | "borrowed"
  amount: number
  date: string
}

const STORAGE_KEY = "friends-data-v2"

export default function FriendsPage() {
  const { addExpense } = useExpenses()

  const [friends, setFriends] = useState<Friend[]>([])
  const [transactions, setTransactions] = useState<FriendTransaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    friendName: "",
    type: "lent" as "lent" | "borrowed",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setFriends(parsed.friends || [])
      setTransactions(parsed.transactions || [])
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ friends, transactions }))
  }, [friends, transactions, isLoaded])

  const totalLent = friends.reduce((acc, f) => acc + f.lent, 0)
  const totalBorrowed = friends.reduce((acc, f) => acc + f.borrowed, 0)
  const netBalance = totalLent - totalBorrowed

  const handleAddTransaction = () => {
    if (!newTransaction.friendName || !newTransaction.amount) return
    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    // Add to friend transactions list
    const transaction: FriendTransaction = {
      id: Date.now().toString(),
      friendName: newTransaction.friendName,
      type: newTransaction.type,
      amount,
      date: newTransaction.date,
    }
    setTransactions((prev) => [transaction, ...prev])

    // Update or add friend balance
    const existingFriend = friends.find(
      (f) => f.name.toLowerCase() === newTransaction.friendName.toLowerCase()
    )
    if (existingFriend) {
      setFriends((prev) =>
        prev.map((f) =>
          f.id === existingFriend.id
            ? {
                ...f,
                lent: newTransaction.type === "lent" ? f.lent + amount : f.lent,
                borrowed: newTransaction.type === "borrowed" ? f.borrowed + amount : f.borrowed,
              }
            : f
        )
      )
    } else {
      const newFriend: Friend = {
        id: Date.now().toString(),
        name: newTransaction.friendName,
        lent: newTransaction.type === "lent" ? amount : 0,
        borrowed: newTransaction.type === "borrowed" ? amount : 0,
      }
      setFriends((prev) => [...prev, newFriend])
    }

    // Lent = money goes out → expense (balance decreases, counted as expense)
    // Borrowed = money comes in → deposit (balance increases)
    if (newTransaction.type === "lent") {
      addExpense({
        description: `Lent to ${newTransaction.friendName}`,
        amount,
        type: "expense",
      } as any)
    } else {
      addExpense({
        description: `Borrowed from ${newTransaction.friendName}`,
        amount,
        type: "deposit",
      } as any)
    }

    setNewTransaction({
      friendName: "",
      type: "lent",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsAddOpen(false)
  }

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id)
    if (!transaction) return

    // Reverse the friend balance
    setFriends((prev) =>
      prev.map((f) => {
        if (f.name.toLowerCase() === transaction.friendName.toLowerCase()) {
          return {
            ...f,
            lent: transaction.type === "lent" ? f.lent - transaction.amount : f.lent,
            borrowed: transaction.type === "borrowed" ? f.borrowed - transaction.amount : f.borrowed,
          }
        }
        return f
      })
    )
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Friends & Lending</h1>
          <p className="text-muted-foreground">Track money lent and borrowed with friends</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Transaction</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Record a new lending or borrowing transaction.
                {newTransaction.type === "lent" && (
                  <span className="block mt-1 text-primary font-medium">
                    💡 Lending money will be recorded as an expense.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="friendName" className="text-foreground">Friend Name</Label>
                <Input
                  id="friendName"
                  value={newTransaction.friendName}
                  onChange={(e) => setNewTransaction({ ...newTransaction, friendName: e.target.value })}
                  placeholder="Enter friend's name"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-foreground">Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: "lent" | "borrowed") =>
                    setNewTransaction({ ...newTransaction, type: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="lent" className="text-foreground hover:bg-secondary cursor-pointer">
                      Lent (You gave money) — counts as expense
                    </SelectItem>
                    <SelectItem value="borrowed" className="text-foreground hover:bg-secondary cursor-pointer">
                      Borrowed (You received money)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-foreground">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-foreground">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Lent</p>
              <p className="text-2xl font-bold text-success">₹{totalLent.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-destructive/20">
              <ArrowDownLeft className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Borrowed</p>
              <p className="text-2xl font-bold text-destructive">₹{totalBorrowed.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-success" : "text-destructive"}`}>
                {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Friends List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Friends Overview</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {friends.map((friend, index) => {
              const net = friend.lent - friend.borrowed
              return (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {friend.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{friend.name}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Lent: ₹{friend.lent.toLocaleString()}</span>
                        <span>Borrowed: ₹{friend.borrowed.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${net >= 0 ? "text-success" : "text-destructive"}`}>
                      {net >= 0 ? "+" : ""}₹{net.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {net >= 0 ? "They owe you" : "You owe them"}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {friends.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No friends added yet. Add a transaction to get started.</p>
          )}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Friend</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell className="text-foreground font-medium">
                      {transaction.friendName}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "lent"
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {transaction.type === "lent" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {transaction.type === "lent" ? "Lent" : "Borrowed"}
                        {transaction.type === "lent" && (
                          <span className="ml-1 text-xs opacity-70">(expense)</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">
                      ₹{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete transaction</span>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}