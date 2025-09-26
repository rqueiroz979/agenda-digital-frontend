import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <header className="flex justify-between items-center px-6 py-4 bg-indigo-800 shadow-md">
        <h1 className="text-xl font-bold">Agenda Digital - Clientes</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/clientes/novo")}
            className="bg-white text-indigo-700 px-3 py-2 rounded-md"
          >
            + Novo Cliente
          </button>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded-md">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center text-white/90">
          <h2 className="text-2xl font-semibold">Bem-vindo</h2>
          <p className="mt-2">Use o botão “Novo Cliente” para cadastrar um cliente.</p>
        </div>
      </main>
    </div>
  );
}
