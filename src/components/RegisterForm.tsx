"use client";

import { useState } from "react";
import { signup } from "../lib/api";
import { validateUsername, validatePassword } from "../lib/validation";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await signup({ username: formData.username, password: formData.password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
          name="reg_username"
          required
          autoComplete="off"
          placeholder="Choose a username"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">Password</label>
        <input
          type="password"
          name="reg_password"
          required
          autoComplete="one-time-code"
          placeholder="Create password"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">Confirm Password</label>
        <input
          type="password"
          name="reg_confirm_password"
          required
          autoComplete="one-time-code"
          placeholder="Confirm password"
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-primary py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-warm active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}