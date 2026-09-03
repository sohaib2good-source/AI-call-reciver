"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function BusinessHoursPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Hours</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Hours"}
        </Button>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Normal Operating Hours</h2>
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="w-32 font-medium">{day}</div>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-sm text-gray-500">Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" className="border rounded p-1" defaultValue="09:00" />
                  <span>-</span>
                  <input type="time" className="border rounded p-1" defaultValue="22:00" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Temporary Closures & Holidays</h2>
          <p className="text-sm text-gray-500 mb-4">Add specific dates when the restaurant will be closed.</p>
          <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-none border">+ Add Holiday Closure</Button>
        </section>
      </div>
    </div>
  );
}
