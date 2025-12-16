"use client";

import Link from "next/link";
import { useAuth } from "../hooks/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-5 5 10 10 0 0 1-5 5 10 10 0 0 1-10-10A10 10 0 0 1 12 2z" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-crust">ThreadTalk</span>
        </Link>

        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
             <span className="hidden sm:inline">{user?.username}</span>
          </div>

          <button 
            onClick={logout} 
            className="text-muted-foreground hover:text-destructive transition-colors"
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