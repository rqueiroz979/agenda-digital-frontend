import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import ClientForm from "./pages/clientform.jsx";
import Home from "./pages/home.jsx";

// simples proteção de rota
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/novo"
          element={
            <PrivateRoute>
              <ClientForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/editar/:id"
          element={
            <PrivateRoute>
              <ClientForm />
            </PrivateRoute>
          }
        />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

