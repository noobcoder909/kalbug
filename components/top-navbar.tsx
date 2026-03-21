"use client"

import { Bell, Search, Menu, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/lib/useAuth"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/backendless-auth"
import { useExpenses } from "@/lib/expenses-context"

interface TopNavbarProps {
  onMenuClick?: () => void
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const { expenses, transactions, monthlyBudget, savingsGoal } = useExpenses()

  const displayName = user?.displayName || "User"
  const email = user?.email || ""
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    router.push("/login")
  }

  const totalDeposited = transactions.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0)
  const totalSpent = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const directExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const netSaved = totalDeposited - Math.max(totalSpent, directExpenses)

  const totalExpensesThisMonth = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const remaining = monthlyBudget - totalExpensesThisMonth
  const isOverBudget = totalExpensesThisMonth > monthlyBudget
  const savingsOnTrack = remaining >= savingsGoal
  const hasAlert = isOverBudget || !savingsOnTrack

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="w-64 pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${hasAlert ? "bg-red-500" : "bg-primary"}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-popover border-border" align="end">
            <DropdownMenuLabel className="text-foreground font-semibold">Savings Summary</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <div className="px-3 py-3 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/60">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-md ${netSaved >= 0 ? "bg-success/20" : "bg-destructive/20"}`}>
                    <PiggyBank className={`w-4 h-4 ${netSaved >= 0 ? "text-success" : "text-destructive"}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Net Saved Overall</p>
                    <p className={`text-sm font-bold ${netSaved >= 0 ? "text-success" : "text-destructive"}`}>
                      {netSaved >= 0 ? "+" : ""}₹{netSaved.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/60">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-md ${remaining >= 0 ? "bg-primary/20" : "bg-red-500/20"}`}>
                    {remaining >= 0
                      ? <TrendingUp className="w-4 h-4 text-primary" />
                      : <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Month Remaining</p>
                    <p className={`text-sm font-bold ${remaining >= 0 ? "text-foreground" : "text-red-500"}`}>
                      {remaining >= 0 ? "" : "-"}₹{Math.abs(remaining).toLocaleString()}
                    </p>
                  </div>
                </div>
                {isOverBudget && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Over budget</span>
                )}
              </div>
              <div className={`p-3 rounded-lg border text-xs ${
                isOverBudget
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : !savingsOnTrack
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-success/10 border-success/30 text-success"
              }`}>
                {isOverBudget
                  ? "⚠️ You've exceeded your monthly budget!"
                  : !savingsOnTrack
                  ? `⚠️ Savings goal of ₹${savingsGoal.toLocaleString()} may not be met.`
                  : `✅ You're on track to save ₹${savingsGoal.toLocaleString()} this month!`}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || ""} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="text-foreground hover:bg-secondary cursor-pointer">
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}