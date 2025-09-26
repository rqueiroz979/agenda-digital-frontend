const API_URL = import.meta.env.VITE_API_URL || ""; // ex: https://agenda-digital-api.onrender.com

async function request(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = data?.error || data?.message || res.statusText || "Erro na requisição";
    throw new Error(err);
  }
  return data;
}

const api = {
  // backend endpoints
  post: (path, body, token) => request(path, "POST", body, token),
  get: (path, token) => request(path, "GET", null, token),
  put: (path, body, token) => request(path, "PUT", body, token),
  delete: (path, token) => request(path, "DELETE", null, token),

  // auth
  login: (email, senha) => request("/api/usuarios/login", "POST", { email, senha }),

  // clients
  saveClient: (payload, token) => request("/api/clientes", "POST", payload, token),
  updateClient: (id, payload, token) => request(`/api/clientes/${id}`, "PUT", payload, token),
  listClients: (token) => request("/api/clientes", "GET", null, token),

  // public lookups (CNPJ & CEP)
  // CNPJ via BrasilAPI (estável)
  fetchCNPJ: async (cnpj) => {
    const clean = String(cnpj).replace(/\D/g, "");
    if (!clean) throw new Error("CNPJ inválido");
    const url = `https://brasilapi.com.br/api/cnpj/v1/${clean}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Erro ao consultar CNPJ");
    }
    return res.json();
  },

  // CEP via ViaCEP
  fetchCEP: async (cep) => {
    const clean = String(cep).replace(/\D/g, "");
    if (!clean) throw new Error("CEP inválido");
    const url = `https://viacep.com.br/ws/${clean}/json/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao consultar CEP");
    return res.json();
  },
};

export default api;
