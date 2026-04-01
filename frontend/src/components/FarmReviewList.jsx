import api from "../services/api";

export default function FarmReviewList({ items, onReload }) {
  async function updateStatus(id, status) {
    await api.patch(`/farm/review/${id}/status`, { status });
    onReload?.();
  }

  return (
    <section id="farms" className="panel">
      <h2>Checar farms de hoje</h2>
      <div className="review-list">
        {items.length ? items.map((item) => (
          <div className="review-card" key={item.id}>
            <div className="review-top">
              <div>
                <strong>{item.characterName}</strong>
                <p className="muted">ID {item.memberId} · @{item.username}</p>
              </div>
              <b className="amount">{item.amount}</b>
            </div>

            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Obs:</strong> {item.notes || "Sem observação"}</p>

            {item.proofImage ? (
              <a className="proof-link" href={`http://localhost:3000/uploads/${item.proofImage}`} target="_blank" rel="noreferrer">
                Ver comprovante
              </a>
            ) : (
              <span className="muted">Sem imagem enviada</span>
            )}

            <div className="actions">
              <button onClick={() => updateStatus(item.id, "aprovado")}>Aprovar</button>
              <button onClick={() => updateStatus(item.id, "pendente")}>Pendente</button>
              <button onClick={() => updateStatus(item.id, "atrasado")}>Atrasado</button>
            </div>
          </div>
        )) : <p className="muted">Nenhum farm enviado hoje.</p>}
      </div>
    </section>
  );
}
