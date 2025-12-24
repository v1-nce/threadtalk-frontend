"use client";

import { useAuth } from '../hooks/AuthProvider';
import AuthPage from '../components/AuthPage';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  );
}
