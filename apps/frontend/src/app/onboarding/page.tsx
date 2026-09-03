'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_CURRENCIES } from '@/constants/currencies';

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(2); // Step 1 is Register
  const router = useRouter();
  
  // Step 2 Data
  const [restaurantName, setRestaurantName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [phone, setPhone] = useState('');
  
  // Step 3 Data
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [reservationEnabled, setReservationEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, POST to /onboarding/complete here
    alert("Workspace Created Successfully!");
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
        
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Information</h2>
              <p className="mt-2 text-sm text-gray-600">Step 2 of Onboarding</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Restaurant Name</label>
                <input required value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Business/Legal Name</label>
                <input required value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Country</label>
                <input required value={country} onChange={e => setCountry(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-white">
                  {SUPPORTED_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Timezone</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Next: Preferences
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Preferences</h2>
              <p className="mt-2 text-sm text-gray-600">Step 3 of Onboarding</p>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={taxEnabled} onChange={e => setTaxEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Tax Enabled</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={reservationEnabled} onChange={e => setReservationEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Reservations Enabled</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={deliveryEnabled} onChange={e => setDeliveryEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Delivery Enabled</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={pickupEnabled} onChange={e => setPickupEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Pickup Enabled</span>
              </label>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Back</button>
              <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Next: Finalize</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleComplete} className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Workspace</h2>
            <p className="mt-2 text-sm text-gray-600">Step 4 of Onboarding</p>
            <div className="rounded-md bg-indigo-50 p-4 mb-4">
              <p className="text-sm text-indigo-700">
                You are about to create the workspace for <strong>{restaurantName}</strong>. 
                This will automatically configure default roles, permissions, AI settings, and business hours.
              </p>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(3)} className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Back</button>
              <button type="submit" className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Finish Setup</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
