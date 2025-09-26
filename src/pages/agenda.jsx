import { useState } from "react";

export default function Agenda() {
  const [eventos, setEventos] = useState([
    { id: 1, titulo: "Reunião com cliente", data: "2025-09-28 14:00" },
    { id: 2, titulo: "Consulta médica", data: "2025-09-29 09:30" },
  ]);

  const handleAdd = () => {
    const novo = {
      id: Date.now(),
      titulo: "Novo compromisso",
      data: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setEventos([...eventos, novo]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <header className="flex justify-between items-center px-6 py-4 bg-indigo-800 shadow-md">
        <h1 className="text-xl font-bold">📅 Minha Agenda</h1>
      </header>

      <main className="flex-grow px-6 py-8">
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg mb-6 transition"
        >
          ➕ Adicionar
        </button>

        <div className="space-y-4">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white text-indigo-700 p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{evento.titulo}</h2>
                <p className="text-sm text-gray-600">{evento.data}</p>
              </div>
              <button
                onClick={() =>
                  setEventos(eventos.filter((e) => e.id !== evento.id))
                }
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
