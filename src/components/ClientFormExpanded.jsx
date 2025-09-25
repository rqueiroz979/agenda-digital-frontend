// src/components/ClientFormExpanded.jsx
import { useState } from "react";

export default function ClientFormExpanded({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      cnpj: "",
      razao_social: "",
      nome_fantasia: "",
      inscricao_estadual: "",
      inscricao_municipal: "",
      telefone: "",
      whatsapp: "",
      email: "",
      endereco: "",
      teamviewer_id: "",
      anydesk_id: "",
      observacoes: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Editar Cliente" : "Novo Cliente"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <label>
          CNPJ
          <input
            type="text"
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label>
          Razão Social
          <input
            type="text"
            name="razao_social"
            value={form.razao_social}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label>
          Nome Fantasia
          <input
            type="text"
            name="nome_fantasia"
            value={form.nome_fantasia}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Inscrição Estadual
          <input
            type="text"
            name="inscricao_estadual"
            value={form.inscricao_estadual}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Inscrição Municipal
          <input
            type="text"
            name="inscricao_municipal"
            value={form.inscricao_municipal}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Telefone
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          WhatsApp
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label className="col-span-2">
          Endereço
          <textarea
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          TeamViewer ID
          <input
            type="text"
            name="teamviewer_id"
            value={form.teamviewer_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          AnyDesk ID
          <input
            type="text"
            name="anydesk_id"
            value={form.anydesk_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label className="col-span-2">
          Observações
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
