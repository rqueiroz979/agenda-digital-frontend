// src/App.jsx
import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./pages/Login";
import ClientList from "./components/ClientList";
import ClientFormExpanded from "./components/ClientFormExpanded";
import ClientView from "./components/ClientView";

export default function App() {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Verifica se existe usuário logado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      carregarClientes();
    }
  }, []);

  // Função para buscar clientes da API
  const carregarClientes = async () => {
    try {
      const res = await api.get("/clientes/");
      setClientes(res.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  // Função para login
  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    carregarClientes();
  };

  // Função para logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setClientes([]);
  };

  // Função para salvar cliente (novo ou editado)
  const handleSaveCliente = async (formData) => {
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente.id}`, formData);
      } else {
        await api.post("/clientes/", formData);
      }
      setShowForm(false);
      setEditingCliente(null);
      carregarClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  // Função para excluir cliente
  const handleDeleteCliente = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
      if (selectedCliente && selectedCliente.id === id) {
        setSelectedCliente(null);
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda Digital</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <button
            onClick={() => {
              setEditingCliente(null);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 mb-4 rounded hover:bg-green-700 w-full"
          >
            Novo Cliente
          </button>

          <ClientList
            clientes={clientes}
            onSelect={setSelectedCliente}
            onEdit={(c) => {
              setEditingCliente(c);
              setShowForm(true);
            }}
            onDelete={handleDeleteCliente}
          />
        </div>

        <div className="col-span-2">
          {showForm ? (
            <ClientFormExpanded
              initialData={editingCliente}
              onSubmit={handleSaveCliente}
              onCancel={() => {
                setShowForm(false);
                setEditingCliente(null);
              }}
            />
          ) : selectedCliente ? (
            <ClientView cliente={selectedCliente} />
          ) : (
            <p className="text-gray-500">Selecione um cliente ou cadastre um novo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
