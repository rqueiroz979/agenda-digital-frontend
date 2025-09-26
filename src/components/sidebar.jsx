import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white/10 backdrop-blur-md p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Agenda Digital</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/agenda" className="block hover:text-blue-400">Agenda</Link>
        <Link to="/usuarios" className="block hover:text-blue-400">Usuários</Link>
      </nav>
    </div>
  );
}
