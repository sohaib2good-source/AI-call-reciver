"use client";

import { Button } from "@ai-restaurant/ui";

export default function PlansPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Upgrade your plan</h1>
        <p className="text-gray-500">Choose the plan that fits your restaurant's volume. All plans include the core AI Receptionist features.</p>
        
        <div className="mt-8 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button className="px-4 py-2 bg-white shadow rounded font-medium text-sm">Monthly billing</button>
            <button className="px-4 py-2 text-gray-600 font-medium text-sm hover:text-gray-900">Annual billing <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded ml-1">SAVE 20%</span></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Starter</h2>
          <p className="text-sm text-gray-500 h-10 mb-4">Perfect for small bistros just getting started with AI.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$99</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <Button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 mb-8">Select Starter</Button>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 mb-4">What's included:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span>✓</span> 500 AI Voice Minutes</li>
              <li className="flex gap-2"><span>✓</span> Standard AI Voices</li>
              <li className="flex gap-2"><span>✓</span> Menu Integration</li>
              <li className="flex gap-2"><span>✓</span> Basic Analytics</li>
            </ul>
          </div>
        </div>

        {/* Professional Plan */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-600 p-8 flex flex-col relative transform scale-105">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Professional</h2>
          <p className="text-sm text-gray-500 h-10 mb-4">For busy restaurants that need serious automation.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$299</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <Button className="w-full bg-blue-600 text-white shadow-none hover:bg-blue-700 mb-8">Current Plan</Button>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 mb-4">Everything in Starter, plus:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span>✓</span> 2,000 AI Voice Minutes</li>
              <li className="flex gap-2 font-medium text-gray-900"><span>✓</span> Direct KDS Injection (POS)</li>
              <li className="flex gap-2 font-medium text-gray-900"><span>✓</span> Upsell Engine</li>
              <li className="flex gap-2"><span>✓</span> Advanced Conversation Logs</li>
            </ul>
          </div>
        </div>

        {/* Business Plan */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Business</h2>
          <p className="text-sm text-gray-500 h-10 mb-4">For multi-location franchises or high-volume ghost kitchens.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$799</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <Button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 mb-8">Select Business</Button>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 mb-4">Everything in Professional, plus:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span>✓</span> 10,000 AI Voice Minutes</li>
              <li className="flex gap-2 font-medium text-gray-900"><span>✓</span> Custom Voice Cloning</li>
              <li className="flex gap-2 font-medium text-gray-900"><span>✓</span> Multi-language Support</li>
              <li className="flex gap-2"><span>✓</span> Dedicated Account Manager</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
