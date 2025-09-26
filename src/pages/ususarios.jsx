export default function Usuarios() {
  const usuarios = [
    { id: 1, nome: "Ramon", email: "ramon@email.com" },
    { id: 2, nome: "Maria", email: "maria@email.com" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Usuários</h1>
      <table className="w-full bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
        <thead className="bg-white/20">
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t border-gray-600">
              <td className="p-3">{u.nome}</td>
              <td className="p-3">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
