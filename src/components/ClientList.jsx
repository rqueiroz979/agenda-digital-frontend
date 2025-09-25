// src/components/ClientList.jsx
export default function ClientList({ clientes, onSelect, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Clientes</h2>
      {clientes.length === 0 ? (
        <p className="text-gray-500">Nenhum cliente cadastrado</p>
      ) : (
        <ul className="divide-y">
          {clientes.map((cliente) => (
            <li key={cliente.id} className="py-2 flex justify-between items-center">
              <span
                onClick={() => onSelect(cliente)}
                className="cursor-pointer hover:underline"
              >
                {cliente.nome_fantasia || cliente.razao_social}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(cliente)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(cliente.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
