"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Bell, Shield, Palette, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/useAuth"
import { signOut, sendPasswordReset } from "@/lib/backendless-auth"

const APP_ID = "A5192853-9A56-481E-9288-FC1D7ACD96D3"
const REST_KEY = "A5570974-1283-4AB2-AD8E-40797731D561"

async function updateUserProfile(objectId: string, token: string, data: { name: string }) {
  const res = await fetch(
    `https://api.backendless.com/${APP_ID}/${REST_KEY}/users/${objectId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "user-token": token,
      },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) throw new Error("Failed to update profile")
  return res.json()
}

export default function SettingsPage() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [saveMsg, setSaveMsg] = useState("")
  const [resetMsg, setResetMsg] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.displayName || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("bl_token") || ""
      await updateUserProfile(user.objectId, token, { name })
      // Update local session
      const updated = { ...user, name, displayName: name }
      localStorage.setItem("bl_user", JSON.stringify(updated))
      setUser(updated)
      setSaveMsg("Profile updated!")
      setTimeout(() => setSaveMsg(""), 3000)
    } catch {
      setSaveMsg("Failed to update. Try again.")
    }
  }

  const handleChangePassword = async () => {
    if (!user?.email) return
    try {
      await sendPasswordReset(user.email)
      setResetMsg("Password reset email sent! Check your inbox.")
      setTimeout(() => setResetMsg(""), 4000)
    } catch {
      setResetMsg("Failed to send reset email.")
    }
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    router.push("/login")
  }

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

      {/* Profile */}
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
                  disabled
                  className="pl-10 h-11 bg-input border-border text-muted-foreground opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
          {saveMsg && (
            <p className={`text-sm ${saveMsg.includes("Failed") ? "text-destructive" : "text-success"}`}>
              {saveMsg}
            </p>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
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
            <Label className="text-foreground">Currency</Label>
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

      {/* Notifications */}
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
          {[
            { label: "Push Notifications", desc: "Receive notifications about your expenses", val: notifications, set: setNotifications },
            { label: "Weekly Report", desc: "Get a weekly summary of your spending", val: weeklyReport, set: setWeeklyReport },
            { label: "Budget Alerts", desc: "Get notified when you exceed budget limits", val: budgetAlerts, set: setBudgetAlerts },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={item.val} onCheckedChange={item.set} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
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
        <div className="space-y-3">
          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="bg-secondary border-border text-foreground hover:bg-secondary/80"
          >
            Change Password
          </Button>
          {resetMsg && (
            <p className={`text-sm ${resetMsg.includes("Failed") ? "text-destructive" : "text-success"}`}>
              {resetMsg}
            </p>
          )}
          <div className="pt-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              Log out
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}