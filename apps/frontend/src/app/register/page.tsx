'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords don't match");
    // Call custom backend /auth/register endpoint here...
    router.push('/onboarding');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">Step 1 of Onboarding</p>
        </div>
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
              <label className="ml-2 block text-sm text-gray-900">I accept the Terms and Privacy Policy</label>
            </div>
          </div>
          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500">
              Continue to Restaurant Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
