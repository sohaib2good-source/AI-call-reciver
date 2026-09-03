"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function BillingDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Billing & Usage</h1>
          <p className="text-gray-500 text-sm">Manage your subscription, view past invoices, and track your AI usage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Plan Overview */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Current Plan</h2>
                <div className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  Professional
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold uppercase tracking-wider border border-green-200">Active</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Your next billing date is <span className="font-medium text-gray-800">August 14, 2026</span></p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">$299<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              </div>
            </div>

            <div className="flex gap-4 border-t pt-6">
              <Link href="/dashboard/billing/plans">
                <Button className="bg-blue-600 text-white shadow-none">Upgrade Plan</Button>
              </Link>
              <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">Cancel Subscription</Button>
            </div>
          </div>

          {/* Usage Tracking */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-bold text-gray-800 mb-6 border-b pb-2">Usage This Billing Cycle</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>AI Voice Minutes</span>
                  <span>1,420 / 2,000 mins</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Overage: $0.15 per additional minute</p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Orders Processed</span>
                  <span>450 / 1,000 orders</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>SMS Segments</span>
                  <span className="text-orange-600 font-bold">5,200 / 5,000 segments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-orange-600 mt-1">You have exceeded your included SMS limit. $4.00 in overages will be applied next invoice.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Payment Method</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-bold text-xs border border-blue-200">VISA</div>
              <div>
                <div className="font-medium text-sm text-gray-900">Visa ending in 4242</div>
                <div className="text-xs text-gray-500">Expires 12/28</div>
              </div>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:underline">Update Payment Method</button>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-800">
              Invoice History
            </div>
            <div className="divide-y text-sm">
              <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">Jul 14, 2026</div>
                  <div className="text-gray-500 text-xs mt-0.5">INV-2026-004 • $299.00</div>
                </div>
                <span className="text-[10px] bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">PAID</span>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">Jun 14, 2026</div>
                  <div className="text-gray-500 text-xs mt-0.5">INV-2026-003 • $299.00</div>
                </div>
                <span className="text-[10px] bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">PAID</span>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">May 14, 2026</div>
                  <div className="text-gray-500 text-xs mt-0.5">INV-2026-002 • $299.00</div>
                </div>
                <span className="text-[10px] bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">PAID</span>
              </div>
            </div>
            <div className="p-3 border-t text-center">
              <button className="text-sm text-blue-600 font-medium hover:underline">View All Invoices</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
