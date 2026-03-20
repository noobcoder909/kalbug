"use client"

import { useState } from "react"
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

interface Friend {
  id: string
  name: string
  lent: number
  borrowed: number
}

interface Transaction {
  id: string
  friendName: string
  type: "lent" | "borrowed"
  amount: number
  date: string
}

const initialFriends: Friend[] = [
  { id: "1", name: "Rahul Sharma", lent: 2500, borrowed: 1000 },
  { id: "2", name: "Priya Patel", lent: 500, borrowed: 1500 },
  { id: "3", name: "Amit Kumar", lent: 3000, borrowed: 0 },
  { id: "4", name: "Sneha Gupta", lent: 0, borrowed: 2000 },
]

const initialTransactions: Transaction[] = [
  { id: "1", friendName: "Rahul Sharma", type: "lent", amount: 1500, date: "2024-03-15" },
  { id: "2", friendName: "Priya Patel", type: "borrowed", amount: 1500, date: "2024-03-14" },
  { id: "3", friendName: "Amit Kumar", type: "lent", amount: 3000, date: "2024-03-12" },
  { id: "4", friendName: "Sneha Gupta", type: "borrowed", amount: 2000, date: "2024-03-10" },
  { id: "5", friendName: "Rahul Sharma", type: "lent", amount: 1000, date: "2024-03-08" },
  { id: "6", friendName: "Rahul Sharma", type: "borrowed", amount: 1000, date: "2024-03-05" },
]

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    friendName: "",
    type: "lent" as "lent" | "borrowed",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  const totalLent = friends.reduce((acc, f) => acc + f.lent, 0)
  const totalBorrowed = friends.reduce((acc, f) => acc + f.borrowed, 0)
  const netBalance = totalLent - totalBorrowed

  const handleAddTransaction = () => {
    if (!newTransaction.friendName || !newTransaction.amount) return

    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      friendName: newTransaction.friendName,
      type: newTransaction.type,
      amount,
      date: newTransaction.date,
    }
    setTransactions([transaction, ...transactions])

    // Update or add friend
    const existingFriend = friends.find(
      (f) => f.name.toLowerCase() === newTransaction.friendName.toLowerCase()
    )

    if (existingFriend) {
      setFriends(
        friends.map((f) =>
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
      setFriends([...friends, newFriend])
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

    // Update friend balance
    setFriends(
      friends.map((f) => {
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

    setTransactions(transactions.filter((t) => t.id !== id))
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
                Record a new lending or borrowing transaction with a friend.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="friendName" className="text-foreground">
                  Friend Name
                </Label>
                <Input
                  id="friendName"
                  value={newTransaction.friendName}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, friendName: e.target.value })
                  }
                  placeholder="Enter friend's name"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-foreground">
                  Type
                </Label>
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
                      Lent (You gave money)
                    </SelectItem>
                    <SelectItem value="borrowed" className="text-foreground hover:bg-secondary cursor-pointer">
                      Borrowed (You received money)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-foreground">
                  Amount (INR)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-foreground">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, date: e.target.value })
                  }
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
              const netBalance = friend.lent - friend.borrowed
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
                    <p className={`text-lg font-bold ${netBalance >= 0 ? "text-success" : "text-destructive"}`}>
                      {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {netBalance >= 0 ? "They owe you" : "You owe them"}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
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
        </div>
      </motion.div>
    </div>
  )
}
