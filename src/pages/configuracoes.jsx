import { useState } from "react";

export default function Configuracoes() {
  const [nome, setNome] = useState("Ramon");
  const [email, setEmail] = useState("ramon@email.com");

  const handleSalvar = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <header className="flex justify-between items-center px-6 py-4 bg-indigo-800 shadow-md">
        <h1 className="text-xl font-bold">⚙️ Configurações</h1>
      </header>

      <main className="flex-grow px-6 py-8">
        <div className="max-w-md mx-auto bg-white text-indigo-700 p-6 rounded-xl shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={handleSalvar}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Salvar
          </button>
        </div>
      </main>
    </div>
  );
}
