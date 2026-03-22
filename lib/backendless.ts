// lib/backendless.ts
const APP_ID = process.env.NEXT_PUBLIC_BACKENDLESS_APP_ID!
const REST_KEY = process.env.NEXT_PUBLIC_BACKENDLESS_REST_KEY!
const BASE_URL = `https://api.backendless.com/${APP_ID}/${REST_KEY}/data`

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("bl_token") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { "user-token": token } : {}),
  }
}

async function bFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Backendless error: ${err}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ─── EXPENSES ────────────────────────────────────────────────────────────────

export async function getExpenses(user_id: string) {
  const where = encodeURIComponent(`user_id = '${user_id}'`)
  return bFetch(`/expenses?where=${where}&pageSize=100&sortBy=created%20desc`)
}

export async function addExpense(data: {
  user_id: string
  expense_name: string
  amount: number
  category: string
  expense_date: string
}) {
  return bFetch("/expenses", { method: "POST", body: JSON.stringify(data) })
}

export async function deleteExpense(objectId: string) {
  return bFetch(`/expenses/${objectId}`, { method: "DELETE" })
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

export async function getTransactions(user_id: string) {
  const where = encodeURIComponent(`user_id = '${user_id}'`)
  return bFetch(`/transactions?where=${where}&pageSize=100&sortBy=created%20desc`)
}

export async function addTransaction(data: {
  user_id: string
  amount: number
  description: string
  type: "deposit" | "expense"
  transaction_date: string
}) {
  return bFetch("/transactions", { method: "POST", body: JSON.stringify(data) })
}

export async function deleteTransaction(objectId: string) {
  return bFetch(`/transactions/${objectId}`, { method: "DELETE" })
}

// ─── FRIENDS ─────────────────────────────────────────────────────────────────

export async function getFriends(user_id: string) {
  const where = encodeURIComponent(`user_id = '${user_id}'`)
  return bFetch(`/friends?where=${where}&pageSize=100`)
}

export async function addFriend(data: {
  user_id: string
  friend_name: string
  lent: number
  borrowed: number
}) {
  return bFetch("/friends", { method: "POST", body: JSON.stringify(data) })
}

export async function updateFriend(
  objectId: string,
  data: { lent?: number; borrowed?: number }
) {
  return bFetch(`/friends/${objectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteFriend(objectId: string) {
  return bFetch(`/friends/${objectId}`, { method: "DELETE" })
}

// ─── FRIEND TRANSACTIONS ─────────────────────────────────────────────────────

export async function getFriendTransactions(user_id: string) {
  const where = encodeURIComponent(`user_id = '${user_id}'`)
  return bFetch(`/friend_transactions?where=${where}&pageSize=100&sortBy=created%20desc`)
}

export async function addFriendTransaction(data: {
  user_id: string
  friend_name: string
  type: "lent" | "borrowed"
  amount: number
  transaction_date: string
}) {
  return bFetch("/friend_transactions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteFriendTransaction(objectId: string) {
  return bFetch(`/friend_transactions/${objectId}`, { method: "DELETE" })
}

// ─── USER SETTINGS ────────────────────────────────────────────────────────────

export async function getUserSettings(user_id: string) {
  const where = encodeURIComponent(`user_id = '${user_id}'`)
  const results = await bFetch(`/user_settings?where=${where}&pageSize=1`)
  return results?.[0] || null
}

export async function saveUserSettings(data: {
  user_id: string
  monthly_budget: number
  savings_goal: number
}) {
  const existing = await getUserSettings(data.user_id)
  if (existing?.objectId) {
    return bFetch(`/user_settings/${existing.objectId}`, {
      method: "PUT",
      body: JSON.stringify({
        monthly_budget: data.monthly_budget,
        savings_goal: data.savings_goal,
      }),
    })
  }
  return bFetch("/user_settings", {
    method: "POST",
    body: JSON.stringify(data),
  })
}