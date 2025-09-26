import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!email || !senha) {
      setErr("Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.login(email, senha); // espera { token, user }
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/home");
      } else {
        setErr("Resposta inesperada do servidor.");
      }
    } catch (error) {
      setErr(error.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6">LOGIN</h1>

        {err && <div className="bg-red-500/80 text-white p-2 rounded mb-3">{err}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 rounded-md bg-white/90 text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-md bg-white/90 text-gray-800"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-white/80">
          <button onClick={() => navigate("/clientes/novo")} className="underline">
            Cadastrar cliente (precisa estar logado)
          </button>
        </div>
      </div>
    </div>
  );
}
