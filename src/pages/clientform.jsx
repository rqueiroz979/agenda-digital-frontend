import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { criarCliente, obterCliente, atualizarCliente, consultarCNPJ, consultarCEP, formatarCNPJ, formatarCEP, formatarTelefone } from "../services/api";

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    telefone1: "",
    telefone2: "",
    email: "",
    inscricao_estadual: "",
    inscricao_municipal: "",
    tipo_pagamento: "",
    valor_mensalidade: "",
    tipo_contrato: "",
    teamviewer_ids: [{ id: "", senha: "" }],
    anydesk_ids: [{ id: "", senha: "" }],
    observacoes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consultandoCNPJ, setConsultandoCNPJ] = useState(false);
  const [consultandoCEP, setConsultandoCEP] = useState(false);

  useEffect(() => {
    if (isEditing) {
      carregarCliente();
    }
  }, [id]);

  const carregarCliente = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const cliente = await obterCliente(id, token);
      
      setFormData({
        ...cliente,
        teamviewer_ids: cliente.teamviewer_ids?.length > 0 ? cliente.teamviewer_ids : [{ id: "", senha: "" }],
        anydesk_ids: cliente.anydesk_ids?.length > 0 ? cliente.anydesk_ids : [{ id: "", senha: "" }],
        valor_mensalidade: cliente.valor_mensalidade || ""
      });
    } catch (error) {
      setError("Erro ao carregar cliente: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoteAccessChange = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRemoteAccess = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { id: "", senha: "" }]
    }));
  };

  const removeRemoteAccess = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleConsultarCNPJ = async () => {
    if (!formData.cnpj) {
      setError("Digite um CNPJ para consultar");
      return;
    }

    try {
      setConsultandoCNPJ(true);
      setError(null);
      const dados = await consultarCNPJ(formData.cnpj);
      
      if (dados) {
        setFormData(prev => ({
          ...prev,
          razao_social: dados.razao_social || prev.razao_social,
          nome_fantasia: dados.nome_fantasia || prev.nome_fantasia,
          endereco: dados.endereco || prev.endereco,
          numero: dados.numero || prev.numero,
          complemento: dados.complemento || prev.complemento,
          bairro: dados.bairro || prev.bairro,
          cidade: dados.cidade || prev.cidade,
          uf: dados.uf || prev.uf,
          cep: dados.cep || prev.cep,
          telefone1: dados.telefone1 || prev.telefone1,
          email: dados.email || prev.email
        }));
      }
    } catch (error) {
      setError("Erro ao consultar CNPJ: " + error.message);
    } finally {
      setConsultandoCNPJ(false);
    }
  };

  const handleConsultarCEP = async () => {
    if (!formData.cep) {
      setError("Digite um CEP para consultar");
      return;
    }

    try {
      setConsultandoCEP(true);
      setError(null);
      const dados = await consultarCEP(formData.cep);
      
      if (dados) {
        setFormData(prev => ({
          ...prev,
          endereco: dados.endereco || prev.endereco,
          complemento: dados.complemento || prev.complemento,
          bairro: dados.bairro || prev.bairro,
          cidade: dados.cidade || prev.cidade,
          uf: dados.uf || prev.uf
        }));
      }
    } catch (error) {
      setError("Erro ao consultar CEP: " + error.message);
    } finally {
      setConsultandoCEP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validações básicas
    if (!formData.cnpj || !formData.razao_social) {
      setError("CNPJ e Razão Social são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Filtra IDs de acesso remoto vazios
      const dadosLimpos = {
        ...formData,
        teamviewer_ids: formData.teamviewer_ids.filter(item => item.id.trim()),
        anydesk_ids: formData.anydesk_ids.filter(item => item.id.trim()),
        valor_mensalidade: formData.valor_mensalidade ? parseFloat(formData.valor_mensalidade) : null
      };

      if (isEditing) {
        await atualizarCliente(id, dadosLimpos, token);
      } else {
        await criarCliente(dadosLimpos, token);
      }

      navigate("/home");
    } catch (error) {
      setError(error.message || "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/home")}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isEditing ? "Editar Cliente" : "Novo Cliente"}
                </h1>
                <p className="text-white/60 text-sm">
                  {isEditing ? "Atualize as informações do cliente" : "Preencha os dados do cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados da Empresa */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Dados da Empresa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  CNPJ *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleConsultarCNPJ}
                    disabled={consultandoCNPJ}
                    className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {consultandoCNPJ ? "..." : "Consultar"}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Razão Social *
                </label>
                <input
                  type="text"
                  name="razao_social"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.razao_social}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  name="nome_fantasia"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.nome_fantasia}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  name="inscricao_estadual"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.inscricao_estadual}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Inscrição Municipal
                </label>
                <input
                  type="text"
                  name="inscricao_municipal"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.inscricao_municipal}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  CEP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cep"
                    placeholder="00000-000"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={handleConsultarCEP}
                    disabled={consultandoCEP}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {consultandoCEP ? "..." : "Buscar"}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.complemento}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  UF
                </label>
                <select
                  name="uf"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.uf}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contatos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Telefone 1
                </label>
                <input
                  type="text"
                  name="telefone1"
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.telefone1}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Telefone 2
                </label>
                <input
                  type="text"
                  name="telefone2"
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.telefone2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Dados Financeiros */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dados Financeiros
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Tipo de Pagamento
                </label>
                <select
                  name="tipo_pagamento"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.tipo_pagamento}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Valor da Mensalidade
                </label>
                <input
                  type="number"
                  name="valor_mensalidade"
                  step="0.01"
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.valor_mensalidade}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Tipo de Contrato
                </label>
                <select
                  name="tipo_contrato"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={formData.tipo_contrato}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Acessos Remotos */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Acessos Remotos
            </h2>

            {/* TeamViewer */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">TeamViewer</h3>
                <button
                  type="button"
                  onClick={() => addRemoteAccess('teamviewer_ids')}
                  disabled={formData.teamviewer_ids.length >= 6}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 px-3 py-1 rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                >
                  + Adicionar
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.teamviewer_ids.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ID TeamViewer"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={item.id}
                      onChange={(e) => handleRemoteAccessChange('teamviewer_ids', index, 'id', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Senha"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={item.senha}
                      onChange={(e) => handleRemoteAccessChange('teamviewer_ids', index, 'senha', e.target.value)}
                    />
                    {formData.teamviewer_ids.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRemoteAccess('teamviewer_ids', index)}
                        className="text-red-300 hover:text-red-200 px-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AnyDesk */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">AnyDesk</h3>
                <button
                  type="button"
                  onClick={() => addRemoteAccess('anydesk_ids')}
                  disabled={formData.anydesk_ids.length >= 6}
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200 px-3 py-1 rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                >
                  + Adicionar
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.anydesk_ids.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ID AnyDesk"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={item.id}
                      onChange={(e) => handleRemoteAccessChange('anydesk_ids', index, 'id', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Senha"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      value={item.senha}
                      onChange={(e) => handleRemoteAccessChange('anydesk_ids', index, 'senha', e.target.value)}
                    />
                    {formData.anydesk_ids.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRemoteAccess('anydesk_ids', index)}
                        className="text-red-300 hover:text-red-200 px-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Observações
            </h2>

            <textarea
              name="observacoes"
              rows={4}
              placeholder="Informações adicionais sobre o cliente..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? "Atualizando..." : "Salvando..."}
                </div>
              ) : (
                isEditing ? "Atualizar Cliente" : "Salvar Cliente"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
