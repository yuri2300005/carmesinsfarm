import { useState } from "react";
import api from "../services/api";

export default function CreateMemberForm({ onSuccess }) {
  const [form, setForm] = useState({
    memberId: "",
    characterName: "",
    username: "",
    password: "",
    role: "member"
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await api.post("/users", form);
      setMessage(data.message);
      setForm({ memberId: "", characterName: "", username: "", password: "", role: "member" });
      onSuccess?.();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Erro ao cadastrar.");
    }
  }

  return (
    <section id="cadastro" className="panel">
      <h2>Cadastrar membro</h2>
      <form className="grid two-cols" onSubmit={handleSubmit}>
        <label>ID
          <input name="memberId" value={form.memberId} onChange={handleChange} />
        </label>
        <label>Nome do personagem
          <input name="characterName" value={form.characterName} onChange={handleChange} />
        </label>
        <label>Nome de usuário
          <input name="username" value={form.username} onChange={handleChange} />
        </label>
        <label>Senha
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <label>Cargo
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Membro</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <div className="form-action">
          <button className="primary-btn" type="submit">Salvar cadastro</button>
        </div>
      </form>
      {message ? <div className="mini-info">{message}</div> : null}
    </section>
  );
}
