"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, DollarSign, Tag, Calendar } from "lucide-react"
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

interface AddExpenseFormProps {
  onAdd: (expense: {
    name: string
    amount: number
    category: string
    date: string
  }) => void
}

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Education",
  "Other",
]

export function AddExpenseForm({ onAdd }: AddExpenseFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !category || !date) return

    onAdd({
      name,
      amount: parseFloat(amount),
      category,
      date,
    })

    setName("")
    setAmount("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="expense-name" className="text-foreground">Description</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="expense-name"
                type="text"
                placeholder="Expense name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="expense-amount" className="text-foreground">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-11 bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="expense-category" className="text-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 bg-input border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-foreground hover:bg-secondary cursor-pointer"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="expense-date" className="text-foreground">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 h-11 bg-input border-border text-foreground"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
