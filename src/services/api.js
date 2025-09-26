const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function callApi(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição");
    }

    return data;
  } catch (error) {
    console.error("Erro API:", error.message);
    throw error;
  }
}

// Autenticação
export const login = (email, senha) => callApi("/login", "POST", { email, senha });
export const register = (nome, email, senha) => callApi("/register", "POST", { nome, email, senha });

// Consultas externas
export const consultarCNPJ = (cnpj) => callApi(`/consultar-cnpj/${cnpj}`);
export const consultarCEP = (cep) => callApi(`/consultar-cep/${cep}`);

// Clientes
export const criarCliente = (clientData, token) => callApi("/clientes", "POST", clientData, token);
export const listarClientes = (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/clientes?${queryString}` : "/clientes";
  return callApi(endpoint, "GET", null, token);
};
export const obterCliente = (id, token) => callApi(`/clientes/${id}`, "GET", null, token);
export const atualizarCliente = (id, clientData, token) => callApi(`/clientes/${id}`, "PUT", clientData, token);
export const deletarCliente = (id, token) => callApi(`/clientes/${id}`, "DELETE", null, token);

// Utilitários
export const formatarCNPJ = (cnpj) => {
  const limpo = cnpj.replace(/\D/g, '');
  if (limpo.length === 14) {
    return `${limpo.slice(0, 2)}.${limpo.slice(2, 5)}.${limpo.slice(5, 8)}/${limpo.slice(8, 12)}-${limpo.slice(12)}`;
  }
  return cnpj;
};

export const formatarCEP = (cep) => {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length === 8) {
    return `${limpo.slice(0, 5)}-${limpo.slice(5)}`;
  }
  return cep;
};

export const formatarTelefone = (telefone) => {
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 11) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
  } else if (limpo.length === 10) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`;
  }
  return telefone;
};

export default {
  login,
  register,
  consultarCNPJ,
  consultarCEP,
  criarCliente,
  listarClientes,
  obterCliente,
  atualizarCliente,
  deletarCliente,
  formatarCNPJ,
  formatarCEP,
  formatarTelefone,
};

