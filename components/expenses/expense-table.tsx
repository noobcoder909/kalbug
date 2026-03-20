"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ShoppingBag, Utensils, Bus, Gamepad2, Coffee, Zap, Heart, GraduationCap, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Expense {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

interface ExpenseTableProps {
  expenses: Expense[]
  onDelete: (id: number) => void
}

const categoryIcons: Record<string, typeof ShoppingBag> = {
  Food: Utensils,
  Transport: Bus,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Health: Heart,
  Education: GraduationCap,
  Other: MoreHorizontal,
}

const categoryColors: Record<string, string> = {
  Food: "bg-chart-1",
  Transport: "bg-chart-2",
  Entertainment: "bg-chart-3",
  Shopping: "bg-chart-4",
  Utilities: "bg-chart-5",
  Health: "bg-primary",
  Education: "bg-chart-2",
  Other: "bg-muted",
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">All Expenses</h3>
        <p className="text-sm text-muted-foreground">{expenses.length} total expenses</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-right text-muted-foreground">Amount</TableHead>
              <TableHead className="text-right text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {expenses.map((expense, index) => {
                const Icon = categoryIcons[expense.category] || MoreHorizontal
                const colorClass = categoryColors[expense.category] || "bg-muted"
                
                return (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", colorClass)}>
                          <Icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        {expense.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expense.category}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(expense.date)}</TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      -₹{expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(expense.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete expense</span>
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {expenses.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No expenses yet. Add your first expense above.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
