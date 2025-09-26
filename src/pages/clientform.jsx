import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Tabs from "../components/Tabs";
import RemoteAccess from "../components/RemoteAccess";

export default function ClientForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // abas: cliente, financeiro, acesso
  const [activeTab, setActiveTab] = useState("cliente");

  // campos (todos obrigatórios conforme você listou)
  const [cnpj, setCnpj] = useState("");
  const [razao, setRazao] = useState("");
  const [fantasia, setFantasia] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // financeiro
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [valorMensalidade, setValorMensalidade] = useState("");
  const [tipoContrato, setTipoContrato] = useState(""); // mensal / anual

  // acesso remoto
  const [teamviewer, setTeamviewer] = useState([]); // array {id, password}
  const [anydesk, setAnydesk] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const [msgSuccess, setMsgSuccess] = useState(null);

  // validação completa (todos obrigatórios listados por você)
  function validateAll() {
    const required = [
      { v: cnpj, name: "CNPJ" },
      { v: razao, name: "Razão Social" },
      { v: fantasia, name: "Nome Fantasia" },
      { v: cep, name: "CEP" },
      { v: endereco, name: "Endereço" },
      { v: numero, name: "Número" },
      { v: complemento, name: "Complemento" },
      { v: bairro, name: "Bairro" },
      { v: cidade, name: "Cidade" },
      { v: uf, name: "UF" },
      { v: inscricaoEstadual, name: "Inscrição Estadual" },
      { v: inscricaoMunicipal, name: "Inscrição Municipal" },
      { v: telefone1, name: "Telefone 1" },
      { v: email, name: "E-mail" },
      { v: observacoes, name: "Observações" },
      { v: tipoPagamento, name: "Tipo de Pagamento" },
      { v: valorMensalidade, name: "Valor da Mensalidade" },
      { v: tipoContrato, name: "Tipo de Contrato" },
    ];

    for (const r of required) {
      if (!String(r.v).trim()) return `Campo obrigatório: ${r.name}`;
    }

    // teamviewer / anydesk: até 6 e cada um com id e senha obrigatórios (você disse que todos esses são obrigatórios)
    for (let i = 0; i < teamviewer.length; i++) {
      if (!teamviewer[i].id || !teamviewer[i].password) return `TeamViewer: preencha ID e senha no item ${i + 1}`;
    }
    for (let i = 0; i < anydesk.length; i++) {
      if (!anydesk[i].id || !anydesk[i].password) return `AnyDesk: preencha ID e senha no item ${i + 1}`;
    }

    return null;
  }

  // consulta CNPJ -> preenche campos (usa api.fetchCNPJ)
  async function handleConsultarCNPJ() {
    setMsgError(null);
    try {
      if (!cnpj) throw new Error("Informe o CNPJ");
      const data = await api.fetchCNPJ(cnpj);
      // estrutura de retorno da BrasilAPI tem campos: razao_social (nome), nome_fantasia, atividade_principal, endereco -> etc
      // adaptamos defensivamente:
      setRazao(data.razao_social || data.nome || "");
      setFantasia(data.nome_fantasia || data.nome || "");
      // endereço tentativa:
      const log = data.estabelecimento?.logradouro || data.main_activity;
      // BrasilAPI returns: "municipio": "São Paulo", "uf": "SP", "bairro": ...
      if (data.estabelecimento) {
        const e = data.estabelecimento;
        setEndereco(e.logradouro || e.nome || "");
        setNumero(e.numero || "");
        setComplemento(e.complemento || "");
        setBairro(e.bairro || "");
        setCidade(e.municipio || "");
        setUf(e.uf || "");
        setCep(e.cep || "");
      } else {
        // try common fields
        setCidade(data.municipio || data.municipio_nome || "");
        setUf(data.uf || "");
      }
      setMsgSuccess("Dados do CNPJ preenchidos (se disponíveis).");
    } catch (err) {
      setMsgError(err.message || "Erro ao consultar CNPJ");
    }
  }

  // consulta CEP via ViaCEP
  async function handlePesquisarCEP() {
    setMsgError(null);
    try {
      if (!cep) throw new Error("Informe o CEP");
      const data = await api.fetchCEP(cep);
      if (data.erro) throw new Error("CEP não encontrado");
      setEndereco(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setUf(data.uf || "");
      setMsgSuccess("CEP consultado e endereço preenchido.");
    } catch (err) {
      setMsgError(err.message || "Erro ao consultar CEP");
    }
  }

  // salvar no backend
  async function handleSalvar() {
    setMsgError(null);
    setMsgSuccess(null);

    const vErr = validateAll();
    if (vErr) {
      setMsgError(vErr);
      // abrir aba correta
      if (vErr.includes("TeamViewer") || vErr.includes("AnyDesk")) setActiveTab("acesso");
      else if (vErr.includes("Pagamento") || vErr.includes("Mensalidade") || vErr.includes("Contrato")) setActiveTab("financeiro");
      else setActiveTab("cliente");
      return;
    }

    const payload = {
      cnpj,
      razao,
      fantasia,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      inscricaoEstadual,
      inscricaoMunicipal,
      telefone1,
      telefone2,
      email,
      observacoes,
      tipoPagamento,
      valorMensalidade,
      tipoContrato,
      teamviewer,
      anydesk,
    };

    try {
      setLoading(true);
      const res = await api.saveClient(payload, token);
      setMsgSuccess("Cliente salvo com sucesso.");
      // limpa formulário (opcional) ou redireciona
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setMsgError(err.message || "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  }

  // abas
  const tabs = [
    { key: "cliente", label: "Dados do Cliente" },
    { key: "financeiro", label: "Financeiro" },
    { key: "acesso", label: "Acesso Remoto" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-6">
      <div className="max-w-3xl mx-auto px-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cadastro de Clientes</h1>
          <div>
            <button onClick={() => navigate("/home")} className="bg-white text-indigo-700 px-3 py-1 rounded-md">
              Voltar
            </button>
          </div>
        </header>

        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6 bg-white/90 text-gray-900 p-6 rounded-xl shadow-lg">
          {msgError && <div className="bg-red-500 text-white p-2 rounded mb-3">{msgError}</div>}
          {msgSuccess && <div className="bg-green-600 text-white p-2 rounded mb-3">{msgSuccess}</div>}

          {activeTab === "cliente" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">CNPJ *</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      className="flex-1 px-3 py-2 border rounded"
                    />
                    <button onClick={handleConsultarCNPJ} className="bg-indigo-600 text-white px-3 rounded">
                      Consultar CNPJ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Inscrição Estadual *</label>
                  <input value={inscricaoEstadual} onChange={(e) => setInscricaoEstadual(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Razão Social / Nome *</label>
                <input value={razao} onChange={(e) => setRazao(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Nome Fantasia *</label>
                <input value={fantasia} onChange={(e) => setFantasia(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">CEP *</label>
                  <div className="flex gap-2 mt-1">
                    <input value={cep} onChange={(e) => setCep(e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                    <button onClick={handlePesquisarCEP} className="bg-indigo-600 text-white px-3 rounded">Pesquisar CEP</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Número *</label>
                  <input value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Complemento *</label>
                  <input value={complemento} onChange={(e) => setComplemento(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Bairro *</label>
                  <input value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Cidade *</label>
                  <input value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">UF *</label>
                  <input value={uf} onChange={(e) => setUf(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Telefone 1 *</label>
                  <input value={telefone1} onChange={(e) => setTelefone1(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Telefone 2</label>
                  <input value={telefone2} onChange={(e) => setTelefone2(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">E-mail *</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Inscrição Municipal *</label>
                <input value={inscricaoMunicipal} onChange={(e) => setInscricaoMunicipal(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Observações *</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" rows={3} />
              </div>
            </div>
          )}

          {activeTab === "financeiro" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Tipo de Pagamento *</label>
                <select value={tipoPagamento} onChange={(e) => setTipoPagamento(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
                  <option value="">Selecione</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="cartao">Cartão</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Valor da Mensalidade (R$) *</label>
                <input value={valorMensalidade} onChange={(e) => setValorMensalidade(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Tipo de Contrato *</label>
                <select value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
                  <option value="">Selecione</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "acesso" && (
            <div className="space-y-4">
              <RemoteAccess tv={teamviewer} ad={anydesk} setTv={setTeamviewer} setAd={setAnydesk} />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={handleSalvar} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
              {loading ? "Salvando..." : "Salvar (F8)"}
            </button>
            <button onClick={() => navigate("/home")} className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md">Cancelar (ESC)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
