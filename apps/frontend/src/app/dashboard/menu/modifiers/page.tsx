"use client";

import { Button } from "@ai-restaurant/ui";

export default function ModifiersPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Modifiers & Add-ons</h1>
        <div className="space-x-4">
          <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">+ Add-on</Button>
          <Button>+ Modifier Group</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Modifiers List */}
        <section className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Modifier Groups</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">Choose Bread</div>
                  <div className="text-xs text-gray-500">Min: 1 | Max: 1 | Required</div>
                </div>
                <button className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="text-sm text-gray-600">Sourdough (+$0), Whole Wheat (+$0), Gluten Free (+$2)</div>
            </div>

            <div className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">Extra Toppings</div>
                  <div className="text-xs text-gray-500">Min: 0 | Max: 5 | Optional</div>
                </div>
                <button className="text-blue-600 text-sm">Edit</button>
              </div>
              <div className="text-sm text-gray-600">Extra Cheese (+$1), Bacon (+$2), Avocado (+$1.5)</div>
            </div>
          </div>
        </section>

        {/* Global Addons List */}
        <section className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Global Add-ons</h2>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium">Gift Wrap</td>
                <td className="p-4 text-gray-600">+$5.00</td>
                <td className="p-4 text-right"><button className="text-blue-600">Edit</button></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium">Premium Cutlery Set</td>
                <td className="p-4 text-gray-600">+$2.50</td>
                <td className="p-4 text-right"><button className="text-blue-600">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
