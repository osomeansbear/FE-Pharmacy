import DashboardStats from "../../components/desktop/admin/dashboard/DashboardStats";

export default function AdminDashboardPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Pharmacy overview</p>
      </div>
      <DashboardStats />
    </main>
  );
}
