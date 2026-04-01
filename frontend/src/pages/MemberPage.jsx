import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BottomNav from "../components/BottomNav";

export default function MemberPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [farms, setFarms] = useState([]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function logout() {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_user");
    navigate("/login");
  }

  async function loadData() {
    try {
      const [{ data: myData }, { data: farmData }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/farm/my")
      ]);

      if (myData.role !== "member") {
        navigate("/");
        return;
      }

      setMe(myData);
      setFarms(farmData);
    } catch {
      logout();
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  async function submitFarm(e) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("notes", notes);
    if (file) formData.append("proof", file);

    try {
      const { data } = await api.post("/farm/my", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(data.message);
      setAmount("");
      setNotes("");
      setFile(null);
      loadData();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Erro ao enviar farm.");
    }
  }

  const today = farms[0];

  return (
    <div className="page-shell">
      <header className="top-header">
        <div>
          <div className="brand">CARMESINSFARM</div>
          <h1>Minha página</h1>
          <p className="muted">
            {me?.characterName || "..."} · ID {me?.memberId || "..."}
          </p>
        </div>
        <button className="ghost-btn" onClick={logout}>Sair</button>
      </header>

      <section className="panel">
        <h2>Meu status de hoje</h2>
        <div className="member-status-box">
          <p><strong>Status:</strong> {today?.status || "sem envio"}</p>
          <p><strong>Farm:</strong> {today?.amount || 0}</p>
          <p><strong>Comprovante:</strong> {today?.proofImage ? "enviado" : "não enviado"}</p>
        </div>
      </section>

      <section className="panel" id="enviar-farm">
        <h2>Enviar farm diário</h2>
        <form className="grid" onSubmit={submitFarm}>
          <label>Quantidade
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>

          <label>Observação
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <label>Imagem / comprovante
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <button className="primary-btn" type="submit">Enviar</button>
        </form>

        {message ? <div className="mini-info">{message}</div> : null}
      </section>

      <section className="panel" id="historico">
        <h2>Meus envios</h2>
        <div className="history-list">
          {farms.map((farm) => (
            <div className="history-item" key={farm.id}>
              <div>
                <strong>{farm.farmDate}</strong>
                <p className="muted">{farm.notes || "Sem observação"}</p>
              </div>
              <div className="history-right">
                <b>{farm.amount}</b>
                <span>{farm.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
