import DashboardCards from "@/components/DashboardCards";

export default function Home() {
  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6 font-bold">Dashboard</h1>

      <DashboardCards />

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-zinc-700 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: "64%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          64% of budget used
        </p>
      </div>
    </div>
  );
}
