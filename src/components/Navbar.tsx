"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/"); 
    router.refresh();
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xl">🍞</div>
             <span className="font-display text-xl font-bold tracking-tight text-crust">ThreadTalk</span>
          </div>
        </div>
      </nav>
    );
  }
  
  const isAuthPage = pathname === "/";

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
          {user ? (
            <>
              <div className="text-sm font-bold text-crust">
                 {user.username}
              </div>
              <button 
                onClick={handleLogout} 
                className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                title="Logout"
              >
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </button>
            </>
          ) : (
            !isAuthPage && (
              <>
                <Link 
                  href="/" 
                  className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  href="/" 
                  className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}