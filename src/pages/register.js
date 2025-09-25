import React, { useState } from "react";
import { apiRequest } from "../services/api";

function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/usuarios/", "POST", form);
      setMessage("Usuário cadastrado com sucesso!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
        <button type="submit">Cadastrar</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
