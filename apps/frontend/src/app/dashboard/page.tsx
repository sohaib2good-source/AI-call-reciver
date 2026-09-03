export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="font-semibold text-sm text-gray-500">Total Reservations</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="font-semibold text-sm text-gray-500">Active Calls</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="font-semibold text-sm text-gray-500">System Health</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">99.9%</p>
        </div>
      </div>
    </div>
  );
}
