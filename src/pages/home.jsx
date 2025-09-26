import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listarClientes, deletarCliente, formatarCNPJ, formatarTelefone } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
    carregarClientes();
  }, [currentPage, searchTerm]);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {
        page: currentPage,
        per_page: 10,
        search: searchTerm
      };
      
      const response = await listarClientes(token, params);
      setClientes(response.clientes || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      setError("Erro ao carregar clientes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const handleDeleteCliente = async (id, nomeCliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${nomeCliente}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await deletarCliente(id, token);
        carregarClientes(); // Recarrega a lista
      } catch (error) {
        alert("Erro ao excluir cliente: " + error.message);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    carregarClientes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agenda Digital</h1>
                <p className="text-white/60 text-sm">Gerenciamento de Clientes</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {usuario && (
                <div className="text-white/80 text-sm">
                  Olá, <span className="font-semibold">{usuario.nome}</span>
                </div>
              )}
              <button
                onClick={() => navigate("/clientes/novo")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Novo Cliente</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl transition-all duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nome, CNPJ ou razão social..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Clients Grid */}
            {clientes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum cliente encontrado</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm ? "Tente ajustar os termos de busca" : "Comece cadastrando seu primeiro cliente"}
                </p>
                <button
                  onClick={() => navigate("/clientes/novo")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Cadastrar Primeiro Cliente
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {cliente.nome_fantasia || cliente.razao_social}
                        </h3>
                        {cliente.nome_fantasia && (
                          <p className="text-white/60 text-sm">{cliente.razao_social}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                          className="text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCliente(cliente.id, cliente.nome_fantasia || cliente.razao_social)}
                          className="text-red-300 hover:text-red-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-white/70">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {formatarCNPJ(cliente.cnpj)}
                      </div>
                      
                      {cliente.telefone1 && (
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {formatarTelefone(cliente.telefone1)}
                        </div>
                      )}

                      {cliente.email && (
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {cliente.email}
                        </div>
                      )}

                      {(cliente.teamviewer_ids?.length > 0 || cliente.anydesk_ids?.length > 0) && (
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Acesso remoto configurado
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Anterior
                </button>
                
                <span className="text-white/70">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

