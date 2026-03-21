"use client";

import { useEffect, useState } from "react";
import { getSession, getCurrentUser, type BLUser } from "./backendless-auth";

export function useAuth() {
  const [user, setUser] = useState<BLUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session first for instant load
    const cached = getSession();
    if (cached) {
      setUser(cached);
      setLoading(false);
      // Silently validate token in background
      getCurrentUser().then((u) => {
        setUser(u);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading, setUser };
}