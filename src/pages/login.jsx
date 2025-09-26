import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      if (!formData.email || !formData.senha) {
        setError("Preencha e-mail e senha.");
        return;
      }
    } else {
      if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
        setError("Preencha todos os campos.");
        return;
      }
      if (formData.senha !== formData.confirmarSenha) {
        setError("As senhas não coincidem.");
        return;
      }
      if (formData.senha.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        const res = await login(formData.email, formData.senha);
        if (res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("usuario", JSON.stringify(res.usuario));
          navigate("/home");
        } else {
          setError("Resposta inesperada do servidor.");
        }
      } else {
        await register(formData.nome, formData.email, formData.senha);
        setError(null);
        setIsLogin(true);
        setFormData({ nome: "", email: "", senha: "", confirmarSenha: "" });
        // Mostrar mensagem de sucesso
        alert("Usuário cadastrado com sucesso! Faça login para continuar.");
      }
    } catch (error) {
      setError(error.message || "Erro na operação");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ nome: "", email: "", senha: "", confirmarSenha: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Agenda Digital</h1>
            <p className="text-white/70 text-sm">
              {isLogin ? "Faça login para continuar" : "Crie sua conta"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={formData.senha}
                onChange={handleInputChange}
              />
            </div>

            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirmar senha"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? "Entrando..." : "Cadastrando..."}
                </div>
              ) : (
                isLogin ? "Entrar" : "Cadastrar"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              {isLogin ? (
                <>Não tem uma conta? <span className="font-semibold text-blue-300">Cadastre-se</span></>
              ) : (
                <>Já tem uma conta? <span className="font-semibold text-blue-300">Faça login</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

