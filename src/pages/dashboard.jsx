import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">📅 Agenda</div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">👤 Usuários</div>
        </div>
      </div>
    </div>
  );
}
