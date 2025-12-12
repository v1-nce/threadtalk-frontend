"use client";

import { useState } from "react";
import { login } from "../lib/api";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-rise" autoComplete="off">
      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">Username</label>
        <input
          type="text"
          name="username_entry"
          required
          autoComplete="off"
          placeholder="Enter your username"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">Password</label>
        <input
          type="password"
          name="password_entry"
          required
          autoComplete="one-time-code"
          placeholder="Enter your password"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-primary py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-warm active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}