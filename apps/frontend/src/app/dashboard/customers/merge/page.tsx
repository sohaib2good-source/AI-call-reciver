"use client";

import { Button } from "@ai-restaurant/ui";

export default function MergeCustomersPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Merge Duplicates</h1>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
        <span className="font-bold">System Warning:</span> We detected 2 potential duplicate customer records based on phone number matching.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Record A */}
        <div className="bg-white p-6 rounded-lg shadow border relative">
          <div className="absolute top-4 right-4">
            <input type="radio" name="master" className="w-5 h-5" defaultChecked />
            <label className="ml-2 text-sm font-bold text-green-600">Keep as Master</label>
          </div>
          <h2 className="font-bold text-lg mb-4">Record A (Older)</h2>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium w-24 inline-block">Name:</span> John Smith</div>
            <div><span className="font-medium w-24 inline-block">Phone:</span> +1 555-9876</div>
            <div><span className="font-medium w-24 inline-block">Email:</span> js@gmail.com</div>
            <div><span className="font-medium w-24 inline-block">LTV:</span> $450.00</div>
            <div><span className="font-medium w-24 inline-block">Orders:</span> 5</div>
          </div>
        </div>

        {/* Record B */}
        <div className="bg-white p-6 rounded-lg shadow border relative">
          <div className="absolute top-4 right-4">
            <input type="radio" name="master" className="w-5 h-5" />
            <label className="ml-2 text-sm font-medium text-gray-500">Merge into Master</label>
          </div>
          <h2 className="font-bold text-lg mb-4">Record B (Newer)</h2>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium w-24 inline-block text-red-600">Name:</span> Jonathan Smith</div>
            <div><span className="font-medium w-24 inline-block">Phone:</span> +1 555-9876</div>
            <div><span className="font-medium w-24 inline-block text-red-600">Email:</span> -</div>
            <div><span className="font-medium w-24 inline-block text-red-600">LTV:</span> $20.00</div>
            <div><span className="font-medium w-24 inline-block text-red-600">Orders:</span> 1</div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
        <Button className="bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200">Ignore</Button>
        <Button className="bg-blue-600 text-white">Merge Selected (LTV: $470.00, Orders: 6)</Button>
      </div>

    </div>
  );
}
