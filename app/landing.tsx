"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Wallet,
  TrendingUp,
  Users,
  Plane,
  BarChart3,
  Bell,
  ArrowRight,
  Shield,
  Zap,
  IndianRupee,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    desc: "Live expense tracking with visual charts. See exactly where your money goes every month.",
  },
  {
    icon: IndianRupee,
    title: "Balance Tracking",
    desc: "Monitor your account balance in real time. Every deposit and expense reflected instantly.",
  },
  {
    icon: Users,
    title: "Friends & Lending",
    desc: "Track who owes you and who you owe. Lent money is auto-counted as an expense.",
  },
  {
    icon: Plane,
    title: "Trip Splitter",
    desc: "Plan group trips and split every bill fairly. Instant settlement calculations.",
  },
  {
    icon: Bell,
    title: "Savings Insights",
    desc: "Smart notifications track your savings goal. Get honest alerts when you overspend.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Firebase authentication keeps your data safe. Your finances stay yours alone.",
  },
]

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "6+", label: "Powerful features" },
  { value: "Live", label: "Real-time sync" },
  { value: "0 ads", label: "No distractions" },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0a0a14", color: "#f0f0f0" }}>

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            left: "5%", top: "10%",
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(0,200,120,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            right: "5%", bottom: "20%",
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(80,120,255,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: "50%", top: "30%",
            width: 300, height: 300,
            background: "radial-gradient(circle, rgba(180,80,255,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-14 py-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#00c878" }}>
            <Wallet style={{ width: 18, height: 18, color: "#000" }} />
          </div>
          <span className="text-lg font-semibold tracking-tight">KalBudget</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ background: "#00c878", color: "#000" }}
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-14 pt-20 pb-24 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border"
            style={{ background: "rgba(0,200,120,0.1)", borderColor: "rgba(0,200,120,0.3)", color: "#00c878" }}
          >
            <Zap className="w-3 h-3" />
            Your finances, finally under control
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
        >
          Budget smarter,{" "}
          <span style={{ color: "#00c878" }}>live better.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Track expenses, manage your balance, split bills with friends, and hit your savings goals — all in one clean, fast app.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:opacity-90"
            style={{ background: "#00c878", color: "#000", boxShadow: "0 0 40px rgba(0,200,120,0.3)" }}
          >
            Start for free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-base border transition-all hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
          >
            Sign in
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mx-6 md:mx-14 rounded-2xl mb-20 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="px-6 py-7 text-center border-r border-b md:border-b-0"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "#00c878" }}>
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-14 mb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Everything you need</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            Six powerful modules working together so your money makes sense.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(0,200,120,0.12)" }}
              >
                <feature.icon className="w-5 h-5" style={{ color: "#00c878" }} />
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-14 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-12 border"
          style={{
            background: "rgba(0,200,120,0.05)",
            borderColor: "rgba(0,200,120,0.2)",
          }}
        >
          <TrendingUp className="w-10 h-10 mx-auto mb-5" style={{ color: "#00c878" }} />
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Ready to take control?</h2>
          <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.38)" }}>
            Join KalBudget and start making every rupee count.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90"
            style={{ background: "#00c878", color: "#000", boxShadow: "0 0 50px rgba(0,200,120,0.35)" }}
          >
            Get started — it&apos;s free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 px-6 md:px-14 py-8 text-center border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#00c878" }}>
            <Wallet style={{ width: 12, height: 12, color: "#000" }} />
          </div>
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>KalBudget</span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          created by <span className="font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Kal</span>
        </p>
      </footer>

    </div>
  )
}