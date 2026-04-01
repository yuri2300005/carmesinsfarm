import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function MemberDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  async function loadData() {
    try {
      const response = await api.get(`/users/${id}`);
      setData(response.data);
    } catch {
      navigate("/");
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <div className="page-shell">
      <header className="top-header">
        <div>
          <div className="brand">CARMESINSFARM</div>
          <h1>Detalhes do membro</h1>
        </div>
        <Link className="ghost-btn link-btn" to="/">Voltar</Link>
      </header>

      <section className="panel">
        <h2>{data?.user?.characterName || "Carregando..."}</h2>
        <p className="muted">
          ID {data?.user?.memberId} · @{data?.user?.username} · {data?.user?.role}
        </p>
      </section>

      <section className="panel">
        <h2>Histórico de farm</h2>
        <div className="history-list">
          {data?.farms?.length ? data.farms.map((farm) => (
            <div className="details-card" key={farm.id}>
              <div className="details-head">
                <strong>{farm.farmDate}</strong>
                <b>{farm.amount}</b>
              </div>
              <p><strong>Status:</strong> {farm.status}</p>
              <p><strong>Observação:</strong> {farm.notes || "Sem observação"}</p>
              {farm.proofImage ? (
                <a className="proof-link" href={`http://localhost:3000/uploads/${farm.proofImage}`} target="_blank" rel="noreferrer">
                  Abrir imagem enviada
                </a>
              ) : (
                <span className="muted">Sem imagem</span>
              )}
            </div>
          )) : <p className="muted">Nenhum farm encontrado.</p>}
        </div>
      </section>
    </div>
  );
}
