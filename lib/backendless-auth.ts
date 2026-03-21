// lib/backendless-auth.ts
// Backendless Authentication client for KalBudget

const APP_ID = "A5192853-9A56-481E-9288-FC1D7ACD96D3"
const REST_KEY = "A5570974-1283-4AB2-AD8E-40797731D561"
const BASE_URL = `https://api.backendless.com/${APP_ID}/${REST_KEY}`

const EMAILJS_SERVICE_ID = "service_7kl95ry"
const EMAILJS_USER_ID = "y31UqQRcIUXS9lcmA"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type BLUser = {
  objectId: string
  uid: string
  email: string
  name: string
  displayName: string
  photoURL: string | null
  "user-token": string
}

// ─── SESSION ──────────────────────────────────────────────────────────────────

const USER_KEY = "bl_user"
const TOKEN_KEY = "bl_token"

export function saveSession(user: BLUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, user["user-token"])
}

export function getSession(): BLUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function normalizeUser(raw: any): BLUser {
  return {
    objectId: raw.objectId,
    uid: raw.objectId,
    email: raw.email || "",
    name: raw.name || raw["user-name"] || raw.email?.split("@")[0] || "User",
    displayName: raw.name || raw["user-name"] || raw.email?.split("@")[0] || "User",
    photoURL: raw.photoURL || null,
    "user-token": raw["user-token"] || "",
  }
}

async function bFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new Error(data?.message || `Backendless error: ${res.status}`)
  }
  return data
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<BLUser> {
  await bFetch("/users/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
  const user = await signInWithEmail(email, password)
  sendWelcomeEmail(String(email), String(name)).catch(console.error)
  return user
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<BLUser> {
  const raw = await bFetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ login: email, password }),
  })
  const user = normalizeUser(raw)
  saveSession(user)
  return user
}

export async function signOut(): Promise<void> {
  const token = getToken()
  if (token) {
    await bFetch("/users/logout", {
      method: "GET",
      headers: { "user-token": token } as any,
    }).catch(() => {})
  }
  clearSession()
}

export async function sendPasswordReset(email: string): Promise<void> {
  await bFetch(`/users/restorepassword/${encodeURIComponent(email)}`, {
    method: "GET",
  })
}

export async function getCurrentUser(): Promise<BLUser | null> {
  const token = getToken()
  if (!token) return null
  try {
    const valid = await bFetch("/users/isvalidusertoken/" + token)
    if (valid === true) return getSession()
    clearSession()
    return null
  } catch {
    clearSession()
    return null
  }
}

// ─── WELCOME EMAIL ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  toEmail: string,
  userName: string
): Promise<void> {
  const lines = [
    "Hi " + userName + "! 👋",
    "",
    "Thank you so much for joining KalBudget — we are thrilled to have you in our community! 🎉",
    "",
    "Here is what you can do:",
    "📊 Track expenses with a live dashboard",
    "💳 Monitor your balance in real time",
    "👫 Manage money lent and borrowed from friends",
    "✈️ Split trip expenses with the trip splitter",
    "🎯 Set monthly budgets and savings goals",
    "",
    "Head over to your dashboard:",
    "https://kal-budget.vercel.app/dashboard",
    "",
    "Happy budgeting,",
    "Kal — KalBudget",
  ]
  const msgText = lines.join("\n")

  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: "template_trg8t22",
    user_id: EMAILJS_USER_ID,
    template_params: {
      from_name: "KalBudget",
      from_email: "kaushallodhi909@proton.me",
      to_email: String(toEmail),
      query_type: "Welcome",
      subject: "Welcome to KalBudget!",
      message: String(msgText),
    },
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error("EmailJS error: " + errText)
  }
}