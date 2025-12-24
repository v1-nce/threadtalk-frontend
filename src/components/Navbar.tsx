"use client";

import Link from "next/link";
import { useAuth } from "../hooks/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xl transition-transform group-hover:scale-105">
            🍞
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-crust">ThreadTalk</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-foreground">
             {user?.username}
          </div>

          <button 
            onClick={logout} 
            className="p-1 text-muted-foreground transition-colors hover:text-destructive"
            title="Logout"
          >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}