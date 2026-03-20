"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Bell, Shield, Palette, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const [currency, setCurrency] = useState("INR")
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Profile</h3>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-chart-2">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-foreground">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-11 bg-input border-border text-foreground max-w-xs">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="INR" className="text-foreground hover:bg-secondary cursor-pointer">INR - Indian Rupee</SelectItem>
                <SelectItem value="USD" className="text-foreground hover:bg-secondary cursor-pointer">USD - US Dollar</SelectItem>
                <SelectItem value="EUR" className="text-foreground hover:bg-secondary cursor-pointer">EUR - Euro</SelectItem>
                <SelectItem value="GBP" className="text-foreground hover:bg-secondary cursor-pointer">GBP - British Pound</SelectItem>
                <SelectItem value="JPY" className="text-foreground hover:bg-secondary cursor-pointer">JPY - Japanese Yen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-chart-3">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Manage notification preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive notifications about your expenses</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Report</p>
              <p className="text-xs text-muted-foreground">Get a weekly summary of your spending</p>
            </div>
            <Switch
              checked={weeklyReport}
              onCheckedChange={setWeeklyReport}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Budget Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when you exceed budget limits</p>
            </div>
            <Switch
              checked={budgetAlerts}
              onCheckedChange={setBudgetAlerts}
            />
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-chart-5">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="bg-secondary border-border text-foreground hover:bg-secondary/80">
            Change Password
          </Button>
          <Button variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 ml-4">
            Delete Account
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
