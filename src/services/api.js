const API_URL = import.meta.env.VITE_API_URL;

export default async function api(endpoint, method = "GET", body = null, token = null) {
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
