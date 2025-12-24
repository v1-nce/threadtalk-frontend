"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-crust mb-2">ThreadTalk</h1>
          <p className="text-muted-foreground">Join the conversation</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="mb-8 flex rounded-xl bg-secondary/50 p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                isLogin ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                !isLogin ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}