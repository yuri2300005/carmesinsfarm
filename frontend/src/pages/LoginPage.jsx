import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("devuri");
  const [password, setPassword] = useState("devuri");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      console.log("LOGIN OK:", response.data);

      localStorage.setItem("cf_token", response.data.token);
      localStorage.setItem("cf_user", JSON.stringify(response.data.user));

      if (response.data.user.role === "member") {
        navigate("/minha-area");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("ERRO LOGIN:", error);
      console.log("RESPOSTA LOGIN:", error?.response?.data);
      setMessage(error?.response?.data?.message || "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand">CARMESINSFARM</div>
        <h1>Entrar no sistema</h1>
        <p className="muted">Usuário padrão: devuri / devuri</p>

        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {message ? <div className="alert">{message}</div> : null}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}