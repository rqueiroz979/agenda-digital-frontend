// src/components/ClientView.jsx
export default function ClientView({ cliente }) {
  const abrirWhatsApp = () => {
    if (cliente.whatsapp) {
      window.open(`https://wa.me/${cliente.whatsapp}`, "_blank");
    }
  };

  const ligarTelefone = () => {
    if (cliente.telefone) {
      window.open(`tel:${cliente.telefone}`);
    }
  };

  const copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto);
    alert("Copiado para a área de transferência!");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{cliente.nome_fantasia || cliente.razao_social}</h2>

      <ul className="space-y-2">
        <li><b>CNPJ:</b> {cliente.cnpj}</li>
        <li><b>Razão Social:</b> {cliente.razao_social}</li>
        <li><b>Inscrição Estadual:</b> {cliente.inscricao_estadual}</li>
        <li><b>Inscrição Municipal:</b> {cliente.inscricao_municipal}</li>
        <li><b>Endereço:</b> {cliente.endereco}</li>
        <li><b>Email:</b> {cliente.email}</li>
        <li><b>Telefone:</b> {cliente.telefone}</li>
        <li><b>WhatsApp:</b> {cliente.whatsapp}</li>
        <li><b>TeamViewer:</b> {cliente.teamviewer_id}</li>
        <li><b>AnyDesk:</b> {cliente.anydesk_id}</li>
        <li><b>Observações:</b> {cliente.observacoes}</li>
      </ul>

      <div className="flex gap-2 mt-4">
        <button
          onClick={abrirWhatsApp}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          WhatsApp
        </button>
        <button
          onClick={ligarTelefone}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ligar
        </button>
        {cliente.teamviewer_id && (
          <button
            onClick={() => copiarTexto(cliente.teamviewer_id)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Copiar TeamViewer
          </button>
        )}
        {cliente.anydesk_id && (
          <button
            onClick={() => copiarTexto(cliente.anydesk_id)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Copiar AnyDesk
          </button>
        )}
      </div>
    </div>
  );
}
