import { Link } from "react-router-dom";

function badgeClass(status) {
  if (status === "aprovado") return "badge approved";
  if (status === "atrasado") return "badge late";
  if (status === "pendente") return "badge pending";
  if (status === "enviado") return "badge sent";
  return "badge none";
}

export default function MembersList({ members }) {
  return (
    <section id="gerenciar" className="panel">
      <h2>Gerenciar membros</h2>
      <div className="table-list">
        <div className="table-head">
          <span>ID</span>
          <span>Nome</span>
          <span>Cargo</span>
          <span>Status</span>
          <span>Farm hoje</span>
        </div>

        {members.map((member) => (
          <Link key={member.id} className="table-row" to={`/membros/${member.id}`}>
            <span>{member.memberId}</span>
            <span>{member.characterName}</span>
            <span className="caps">{member.role}</span>
            <span><b className={badgeClass(member.todayStatus)}>{member.todayStatus}</b></span>
            <span>{member.todayAmount}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
