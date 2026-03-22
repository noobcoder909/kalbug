"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Lightbulb, Bug, Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type QueryType = "bug" | "feature" | "general"

const queryTypes: {
  value: QueryType
  label: string
  icon: React.ElementType
  desc: string
  color: string
}[] = [
  {
    value: "bug",
    label: "Bug Report",
    icon: Bug,
    desc: "Something isn't working right",
    color: "border-red-500/40 bg-red-500/10 text-red-400",
  },
  {
    value: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    desc: "Suggest something new",
    color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  },
  {
    value: "general",
    label: "General Query",
    icon: MessageSquare,
    desc: "Anything else on your mind",
    color: "border-primary/40 bg-primary/10 text-primary",
  },
]

export default function ReportPage() {
  const [queryType, setQueryType] = useState<QueryType>("general")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message) return

    setStatus("sending")
    setErrorMsg("")

    try {
      const payload = {
service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
template_id: process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE,
user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
        template_params: {
          from_name: name,
          from_email: email || "Not provided",
          query_type: queryTypes.find((q) => q.value === queryType)?.label,
          subject: subject || `[${queryType.toUpperCase()}] BudgetFlow Feedback`,
          message,
          to_email: "kaushallodhi909@proton.me",
        },
      }

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
        setQueryType("general")
      } else {
        throw new Error("Failed to send")
      }
    } catch {
      setStatus("error")
      setErrorMsg(
        "Could not send message. Please try again or email directly at kaushallodhi909@proton.me"
      )
    }
  }

  const selectedType = queryTypes.find((q) => q.value === queryType)!

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-foreground">Report & Feedback</h1>
        <p className="text-muted-foreground">Found a bug? Have a feature idea? We'd love to hear from you.</p>
      </motion.div>

      {/* Query type selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {queryTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setQueryType(type.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              queryType === type.value
                ? type.color
                : "border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:bg-secondary/50"
            }`}
          >
            <type.icon className="w-5 h-5 mb-2" />
            <p className="text-sm font-semibold">{type.label}</p>
            <p className="text-xs mt-0.5 opacity-70">{type.desc}</p>
          </button>
        ))}
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="glass rounded-xl p-6"
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatus("idle")}
                className="border-border text-foreground hover:bg-secondary mt-2"
              >
                Send another
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Your Email{" "}
                    <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={`[${selectedType.label}] — brief description`}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    queryType === "bug"
                      ? "Describe the bug — what happened, what did you expect?"
                      : queryType === "feature"
                      ? "Describe the feature you'd like to see..."
                      : "Write your query or feedback here..."
                  }
                  required
                  rows={5}
                  className="w-full rounded-md px-3 py-2 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{message.length} characters</p>
              </div>

              {status === "error" && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={status === "sending" || !name || !message}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Created by */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="text-center pb-4"
      >
        <p className="text-xs text-muted-foreground/50">
          created by <span className="text-muted-foreground/80 font-medium">Kaushal</span>
        </p>
      </motion.div>

    </div>
  )
}