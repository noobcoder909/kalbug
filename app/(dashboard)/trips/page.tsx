"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plane, 
  Plus, 
  Trash2, 
  Users, 
  Receipt, 
  Calculator,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  Archive
} from "lucide-react"
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
import { cn } from "@/lib/utils"

interface Participant {
  id: string
  name: string
}

interface Expense {
  id: string
  amount: number
  paidBy: string
  splitBetween: string[]
  description: string
  date: string
}

interface Trip {
  id: string
  name: string
  participants: Participant[]
  expenses: Expense[]
}

interface Settlement {
  from: string
  to: string
  amount: number
}

const STORAGE_KEY = "budget-app-trips"

const defaultTrips: Trip[] = [
  {
    id: "1",
    name: "Goa Trip 2024",
    participants: [
      { id: "p1", name: "Rahul" },
      { id: "p2", name: "Priya" },
      { id: "p3", name: "Amit" },
      { id: "p4", name: "Sneha" },
    ],
    expenses: [
      { id: "e1", amount: 5000, paidBy: "Rahul", splitBetween: ["Rahul", "Priya", "Amit", "Sneha"], description: "Hotel booking", date: "2024-01-15" },
      { id: "e2", amount: 2000, paidBy: "Priya", splitBetween: ["Rahul", "Priya", "Amit", "Sneha"], description: "Dinner", date: "2024-01-15" },
      { id: "e3", amount: 1500, paidBy: "Amit", splitBetween: ["Rahul", "Amit", "Sneha"], description: "Water sports", date: "2024-01-16" },
      { id: "e4", amount: 800, paidBy: "Sneha", splitBetween: ["Priya", "Sneha"], description: "Shopping", date: "2024-01-16" },
    ],
  },
]

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load trips from localStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem(STORAGE_KEY)
    if (savedTrips) {
      try {
        const parsed = JSON.parse(savedTrips)
        setTrips(parsed)
        setSelectedTrip(parsed[0] || null)
      } catch {
        setTrips(defaultTrips)
        setSelectedTrip(defaultTrips[0])
      }
    } else {
      setTrips(defaultTrips)
      setSelectedTrip(defaultTrips[0])
    }
    setIsLoaded(true)
  }, [])

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
    }
  }, [trips, isLoaded])
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [newTripName, setNewTripName] = useState("")
  const [newParticipants, setNewParticipants] = useState("")
  const [expandedSection, setExpandedSection] = useState<string | null>("expenses")

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expensePaidBy, setExpensePaidBy] = useState("")
  const [expenseSplitBetween, setExpenseSplitBetween] = useState<string[]>([])
  const [expenseDescription, setExpenseDescription] = useState("")

  const handleCreateTrip = () => {
    if (!newTripName.trim() || !newParticipants.trim()) return

    const participantNames = newParticipants.split(",").map(p => p.trim()).filter(p => p)
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: newTripName,
      participants: participantNames.map((name, idx) => ({ id: `p${idx}`, name })),
      expenses: [],
    }

    setTrips([...trips, newTrip])
    setSelectedTrip(newTrip)
    setNewTripName("")
    setNewParticipants("")
    setIsCreateTripOpen(false)
  }

  const handleAddExpense = () => {
    if (!selectedTrip || !expenseAmount || !expensePaidBy || expenseSplitBetween.length === 0) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(expenseAmount),
      paidBy: expensePaidBy,
      splitBetween: expenseSplitBetween,
      description: expenseDescription || "Expense",
      date: new Date().toISOString().split("T")[0],
    }

    const updatedTrip = {
      ...selectedTrip,
      expenses: [...selectedTrip.expenses, newExpense],
    }

    setTrips(trips.map(t => t.id === selectedTrip.id ? updatedTrip : t))
    setSelectedTrip(updatedTrip)
    setExpenseAmount("")
    setExpensePaidBy("")
    setExpenseSplitBetween([])
    setExpenseDescription("")
    setIsAddExpenseOpen(false)
  }

  const handleDeleteExpense = (expenseId: string) => {
    if (!selectedTrip) return

    const updatedTrip = {
      ...selectedTrip,
      expenses: selectedTrip.expenses.filter(e => e.id !== expenseId),
    }

    setTrips(trips.map(t => t.id === selectedTrip.id ? updatedTrip : t))
    setSelectedTrip(updatedTrip)
  }

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(t => t.id !== tripId)
    setTrips(updatedTrips)
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(updatedTrips[0] || null)
    }
  }

  const toggleParticipant = (name: string) => {
    setExpenseSplitBetween(prev => 
      prev.includes(name) 
        ? prev.filter(p => p !== name)
        : [...prev, name]
    )
  }

  const selectAllParticipants = () => {
    if (!selectedTrip) return
    setExpenseSplitBetween(selectedTrip.participants.map(p => p.name))
  }

  // Calculate summaries
  const calculateSummary = () => {
    if (!selectedTrip) return { totalPaid: {}, totalShare: {}, netBalance: {} }

    const totalPaid: Record<string, number> = {}
    const totalShare: Record<string, number> = {}

    selectedTrip.participants.forEach(p => {
      totalPaid[p.name] = 0
      totalShare[p.name] = 0
    })

    selectedTrip.expenses.forEach(expense => {
      totalPaid[expense.paidBy] = (totalPaid[expense.paidBy] || 0) + expense.amount
      const sharePerPerson = expense.amount / expense.splitBetween.length
      expense.splitBetween.forEach(person => {
        totalShare[person] = (totalShare[person] || 0) + sharePerPerson
      })
    })

    const netBalance: Record<string, number> = {}
    selectedTrip.participants.forEach(p => {
      netBalance[p.name] = (totalPaid[p.name] || 0) - (totalShare[p.name] || 0)
    })

    return { totalPaid, totalShare, netBalance }
  }

  const calculateSettlements = (): Settlement[] => {
    const { netBalance } = calculateSummary()
    const settlements: Settlement[] = []

    const debtors = Object.entries(netBalance)
      .filter(([_, balance]) => balance < 0)
      .map(([name, balance]) => ({ name, amount: Math.abs(balance) }))
      .sort((a, b) => b.amount - a.amount)

    const creditors = Object.entries(netBalance)
      .filter(([_, balance]) => balance > 0)
      .map(([name, balance]) => ({ name, amount: balance }))
      .sort((a, b) => b.amount - a.amount)

    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]
      const amount = Math.min(debtor.amount, creditor.amount)

      if (amount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount * 100) / 100,
        })
      }

      debtor.amount -= amount
      creditor.amount -= amount

      if (debtor.amount < 0.01) i++
      if (creditor.amount < 0.01) j++
    }

    return settlements
  }

  const { totalPaid, totalShare, netBalance } = calculateSummary()
  const settlements = calculateSettlements()
  const totalExpenses = selectedTrip?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trip Expense Splitter</h1>
          <p className="text-muted-foreground">Split expenses fairly with your travel buddies</p>
        </div>
        <Dialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-border sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Trip</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter trip details and add participants
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tripName" className="text-foreground">Trip Name</Label>
                <Input
                  id="tripName"
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  placeholder="e.g., Goa Trip 2024"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="participants" className="text-foreground">Participants</Label>
                <Input
                  id="participants"
                  value={newParticipants}
                  onChange={(e) => setNewParticipants(e.target.value)}
                  placeholder="e.g., Rahul, Priya, Amit"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Separate names with commas</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTripOpen(false)} className="border-border text-foreground hover:bg-secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateTrip} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Trip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saved Trips */}
      {trips.length > 0 && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Archive className="w-4 h-4 text-primary" />
            <Label className="text-foreground">Saved Trips ({trips.length})</Label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map(trip => {
              const tripTotal = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all cursor-pointer group",
                    selectedTrip?.id === trip.id
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary/50 border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTrip(trip.id)
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all h-7 w-7"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground truncate pr-6">{trip.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{trip.participants.length} people</span>
                    <span>₹{tripTotal.toFixed(0)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {trip.expenses.length} expense{trip.expenses.length !== 1 ? "s" : ""}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {selectedTrip && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Participants</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{selectedTrip.participants.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTrip.participants.map(p => p.name).join(", ")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-chart-1/20">
                  <Receipt className="w-5 h-5 text-chart-1" />
                </div>
                <span className="text-sm text-muted-foreground">Total Expenses</span>
              </div>
              <p className="text-2xl font-bold text-foreground">₹{totalExpenses.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTrip.expenses.length} transactions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-chart-2/20">
                  <Calculator className="w-5 h-5 text-chart-2" />
                </div>
                <span className="text-sm text-muted-foreground">Per Person (Avg)</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ₹{(totalExpenses / selectedTrip.participants.length).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Equal split</p>
            </motion.div>
          </div>

          {/* Expenses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === "expenses" ? null : "expenses")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Expenses</span>
                <span className="text-sm text-muted-foreground">({selectedTrip.expenses.length})</span>
              </div>
              {expandedSection === "expenses" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "expenses" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border"
                >
                  <div className="p-4">
                    <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expense
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-border sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Add Expense</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Record a new expense for this trip
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-foreground">Amount (INR)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={expenseAmount}
                              onChange={(e) => setExpenseAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="paidBy" className="text-foreground">Paid By</Label>
                            <Select value={expensePaidBy} onValueChange={setExpensePaidBy}>
                              <SelectTrigger className="bg-secondary border-border text-foreground">
                                <SelectValue placeholder="Who paid?" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {selectedTrip.participants.map(p => (
                                  <SelectItem key={p.id} value={p.name} className="text-foreground hover:bg-secondary cursor-pointer">
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-foreground">Split Between</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={selectAllParticipants}
                                className="text-primary hover:text-primary/80 h-auto py-0"
                              >
                                Select All
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedTrip.participants.map(p => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => toggleParticipant(p.name)}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                                    expenseSplitBetween.includes(p.name)
                                      ? "bg-primary/20 border-primary text-foreground"
                                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                    expenseSplitBetween.includes(p.name)
                                      ? "bg-primary border-primary"
                                      : "border-muted-foreground"
                                  )}>
                                    {expenseSplitBetween.includes(p.name) && (
                                      <Check className="w-3 h-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description" className="text-foreground">Description</Label>
                            <Input
                              id="description"
                              value={expenseDescription}
                              onChange={(e) => setExpenseDescription(e.target.value)}
                              placeholder="e.g., Dinner, Hotel, Transport"
                              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)} className="border-border text-foreground hover:bg-secondary">
                            Cancel
                          </Button>
                          <Button onClick={handleAddExpense} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Add Expense
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {selectedTrip.expenses.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No expenses yet. Add your first expense!</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedTrip.expenses.map((expense, index) => (
                          <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{expense.description}</span>
                                <span className="text-xs text-muted-foreground">({expense.date})</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span>Paid by <span className="text-primary">{expense.paidBy}</span></span>
                                <span>•</span>
                                <span>Split between {expense.splitBetween.length} people</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-foreground">₹{expense.amount.toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === "summary" ? null : "summary")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-chart-2" />
                <span className="font-semibold text-foreground">Summary</span>
              </div>
              {expandedSection === "summary" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "summary" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border"
                >
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Person</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Paid</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Share</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Net Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTrip.participants.map((p, index) => (
                            <motion.tr
                              key={p.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-border/50 hover:bg-secondary/30"
                            >
                              <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                              <td className="py-3 px-4 text-right text-foreground">₹{(totalPaid[p.name] || 0).toFixed(2)}</td>
                              <td className="py-3 px-4 text-right text-foreground">₹{(totalShare[p.name] || 0).toFixed(2)}</td>
                              <td className={cn(
                                "py-3 px-4 text-right font-semibold",
                                (netBalance[p.name] || 0) >= 0 ? "text-success" : "text-destructive"
                              )}>
                                {(netBalance[p.name] || 0) >= 0 ? "+" : ""}₹{(netBalance[p.name] || 0).toFixed(2)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Settlements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === "settlements" ? null : "settlements")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-chart-1" />
                <span className="font-semibold text-foreground">Settlements</span>
                {settlements.length > 0 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {settlements.length} payment{settlements.length > 1 ? "s" : ""} needed
                  </span>
                )}
              </div>
              {expandedSection === "settlements" ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === "settlements" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border"
                >
                  <div className="p-4">
                    {settlements.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        All settled! No payments needed.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {settlements.map((settlement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-destructive">
                                  {settlement.from.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{settlement.from}</span>
                                <p className="text-xs text-muted-foreground">pays</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <ArrowRight className="w-5 h-5 text-primary mx-auto" />
                                <span className="text-lg font-bold text-primary">₹{settlement.amount.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="font-medium text-foreground">{settlement.to}</span>
                                <p className="text-xs text-muted-foreground">receives</p>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-success">
                                  {settlement.to.charAt(0)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {trips.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-4">Create your first trip to start splitting expenses</p>
          <Button onClick={() => setIsCreateTripOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Trip
          </Button>
        </motion.div>
      )}
    </div>
  )
}
