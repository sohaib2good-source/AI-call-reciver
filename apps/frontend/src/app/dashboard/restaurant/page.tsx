"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";

export default function RestaurantProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Restaurant Profile</h1>
      
      <form onSubmit={handleSave} className="space-y-8 bg-white p-6 rounded-lg shadow border">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="The Grand AI Cafe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Legal Name</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="Grand AI Cafe LLC" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded p-2" rows={4} defaultValue="A futuristic dining experience powered by AI." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Cuisine Type</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="International" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded p-2" defaultValue="hello@grandai.cafe" />
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-4 border-b pb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="123 AI Boulevard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="San Francisco" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State / Province</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="CA" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="94103" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input type="text" className="w-full border rounded p-2" defaultValue="USA" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
