"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, ArrowUpRight, ArrowDownLeft, Plus, Trash2, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useExpenses } from "@/lib/expenses-context"
import { useAuth } from "@/lib/useAuth"
import {
  getFriends,
  addFriend,
  updateFriend,
  getFriendTransactions,
  addFriendTransaction,
  deleteFriendTransaction,
} from "@/lib/backendless"

interface Friend {
  objectId: string
  friend_name: string
  lent: number
  borrowed: number
}

interface FriendTransaction {
  objectId: string
  friend_name: string
  type: "lent" | "borrowed"
  amount: number
  transaction_date: string
}

export default function FriendsPage() {
  const { addExpense } = useExpenses()
  const { user } = useAuth()

  const [friends, setFriends] = useState<Friend[]>([])
  const [transactions, setTransactions] = useState<FriendTransaction[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    friendName: "",
    type: "lent" as "lent" | "borrowed",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return
    setPageLoading(true)
    try {
      const [friendsData, txData] = await Promise.all([
        getFriends(user.uid),
        getFriendTransactions(user.uid),
      ])
      setFriends(friendsData || [])
      setTransactions(txData || [])
    } catch (err) {
      console.error("Failed to load friends data:", err)
    } finally {
      setPageLoading(false)
    }
  }

  const totalLent = friends.reduce((acc, f) => acc + f.lent, 0)
  const totalBorrowed = friends.reduce((acc, f) => acc + f.borrowed, 0)
  const netBalance = totalLent - totalBorrowed

  const handleAddTransaction = async () => {
    if (!newTransaction.friendName || !newTransaction.amount || !user) return
    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) return

    setSubmitting(true)
    try {
      const savedTx = await addFriendTransaction({
        user_id: user.uid,
        friend_name: newTransaction.friendName,
        type: newTransaction.type,
        amount,
        transaction_date: newTransaction.date,
      })
      setTransactions((prev) => [savedTx, ...prev])

      const existing = friends.find(
        (f) => f.friend_name.toLowerCase() === newTransaction.friendName.toLowerCase()
      )

      if (existing) {
        const updatedLent =
          newTransaction.type === "lent" ? existing.lent + amount : existing.lent
        const updatedBorrowed =
          newTransaction.type === "borrowed" ? existing.borrowed + amount : existing.borrowed
        await updateFriend(existing.objectId, { lent: updatedLent, borrowed: updatedBorrowed })
        setFriends((prev) =>
          prev.map((f) =>
            f.objectId === existing.objectId
              ? { ...f, lent: updatedLent, borrowed: updatedBorrowed }
              : f
          )
        )
      } else {
        const newFriend = await addFriend({
          user_id: user.uid,
          friend_name: newTransaction.friendName,
          lent: newTransaction.type === "lent" ? amount : 0,
          borrowed: newTransaction.type === "borrowed" ? amount : 0,
        })
        setFriends((prev) => [...prev, newFriend])
      }

      if (newTransaction.type === "lent") {
        addExpense({
          description: `Lent to ${newTransaction.friendName}`,
          amount,
          type: "expense",
        })
      } else {
        addExpense({
          description: `Borrowed from ${newTransaction.friendName}`,
          amount,
          type: "deposit",
        })
      }

      setNewTransaction({
        friendName: "",
        type: "lent",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      })
      setIsAddOpen(false)
    } catch (err) {
      console.error("Failed to add friend transaction:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTransaction = async (objectId: string) => {
    try {
      await deleteFriendTransaction(objectId)
      setTransactions((prev) => prev.filter((t) => t.objectId !== objectId))
    } catch (err) {
      console.error("Failed to delete transaction:", err)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Friends & Lending</h1>
          <p className="text-muted-foreground">Track money lent and borrowed with friends</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
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
                <Label className="text-foreground">Friend Name</Label>
                <Input
                  value={newTransaction.friendName}
                  onChange={(e) => setNewTransaction({ ...newTransaction, friendName: e.target.value })}
                  placeholder="Enter friend's name"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(v: "lent" | "borrowed") =>
                    setNewTransaction({ ...newTransaction, type: v })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="lent" className="text-foreground cursor-pointer">
                      Lent (You gave money) — counts as expense
                    </SelectItem>
                    <SelectItem value="borrowed" className="text-foreground cursor-pointer">
                      Borrowed (You received money)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Amount (₹)</Label>
                <Input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Date</Label>
                <Input
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
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Add Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Lent", value: totalLent, color: "text-success", bg: "bg-success/20", Icon: ArrowUpRight, iconColor: "text-success" },
          { label: "Total Borrowed", value: totalBorrowed, color: "text-destructive", bg: "bg-destructive/20", Icon: ArrowDownLeft, iconColor: "text-destructive" },
          { label: "Net Balance", value: netBalance, color: netBalance >= 0 ? "text-success" : "text-destructive", bg: "bg-primary/20", Icon: Users, iconColor: "text-primary" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value >= 0 && card.label === "Net Balance" ? "+" : ""}₹{card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Friends Overview</h2>
        <div className="space-y-3">
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No friends added yet. Add a transaction to get started.
            </p>
          ) : (
            <AnimatePresence>
              {friends.map((friend, i) => {
                const net = friend.lent - friend.borrowed
                return (
                  <motion.div
                    key={friend.objectId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {friend.friend_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{friend.friend_name}</p>
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
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
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
                {transactions.map((tx, i) => (
                  <motion.tr
                    key={tx.objectId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell className="text-foreground font-medium">{tx.friend_name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === "lent" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      }`}>
                        {tx.type === "lent"
                          ? <ArrowUpRight className="w-3 h-3" />
                          : <ArrowDownLeft className="w-3 h-3" />}
                        {tx.type === "lent" ? "Lent" : "Borrowed"}
                        {tx.type === "lent" && <span className="ml-1 opacity-70">(expense)</span>}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">₹{tx.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {tx.transaction_date}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(tx.objectId)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
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