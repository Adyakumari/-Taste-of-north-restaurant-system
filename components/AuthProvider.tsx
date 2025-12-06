"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  signup: (name: string, email: string, password: string, remember?: boolean) => Promise<boolean>;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
};

const USERS_KEY = "auth_users";
const CURRENT_USER_KEY = "auth_current_user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const rawLocal = localStorage.getItem(CURRENT_USER_KEY);
      const rawSession = sessionStorage.getItem(CURRENT_USER_KEY);
      const raw = rawLocal || rawSession;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const api = useMemo<AuthContextValue>(() => {
    function readUsers(): Array<AuthUser & { password: string }> {
      try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    function writeUsers(users: Array<AuthUser & { password: string }>) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function persistCurrentUser(safeUser: AuthUser, remember?: boolean) {
      if (remember) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        sessionStorage.removeItem(CURRENT_USER_KEY);
      } else {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    return {
      user,
      async signup(name: string, email: string, password: string, remember?: boolean) {
        const users = readUsers();
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return false;
        const newUser: AuthUser & { password: string } = {
          id: nanoid(12),
          name,
          email,
          password,
        };
        users.push(newUser);
        writeUsers(users);
        const { password: _pw, ...safeUser } = newUser;
        persistCurrentUser(safeUser, remember);
        setUser(safeUser);
        return true;
      },
      async login(email: string, password: string, remember?: boolean) {
        const users = readUsers();
        const match = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!match) return false;
        const { password: _pw, ...safeUser } = match;
        persistCurrentUser(safeUser, remember);
        setUser(safeUser);
        return true;
      },
      logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        sessionStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


