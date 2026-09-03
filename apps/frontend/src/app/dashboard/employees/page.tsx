"use client";

import { Button } from "@ai-restaurant/ui";

export default function EmployeesPage() {
  const employees = [
    { name: "Alice Johnson", email: "alice@grandai.cafe", role: "OWNER", status: "Active" },
    { name: "Bob Smith", email: "bob@grandai.cafe", role: "MANAGER", status: "Active" },
    { name: "Charlie Davis", email: "charlie@grandai.cafe", role: "RECEPTIONIST", status: "Pending" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees & Staff</h1>
        <Button>+ Invite Staff</Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Email</th>
              <th className="p-4 font-medium text-gray-600">Role</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.map((emp, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{emp.name}</td>
                <td className="p-4 text-gray-600">{emp.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                    {emp.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
