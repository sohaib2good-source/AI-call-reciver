"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // MOCK LOGIN FOR UI TESTING (Bypassing backend since DB is down)
      console.log('Mock logging in with:', { email, password });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!email.includes('@')) {
        alert('Invalid email format');
        return;
      }
      
      localStorage.setItem('accessToken', 'mock_jwt_token_123');
      localStorage.setItem('tenantId', 'tenant_123');
      
      alert('Mock logged in successfully! Redirecting to dashboard...');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white shadow rounded-lg border">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border rounded p-2" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border rounded p-2" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
