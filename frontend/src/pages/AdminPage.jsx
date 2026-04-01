import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BottomNav from "../components/BottomNav";
import CreateMemberForm from "../components/CreateMemberForm";
import MembersList from "../components/MembersList";
import FarmReviewList from "../components/FarmReviewList";

export default function AdminPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [members, setMembers] = useState([]);
  const [reviews, setReviews] = useState([]);

  function logout() {
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_user");
    navigate("/login");
  }

  async function loadData() {
    try {
      const [{ data: myData }, { data: memberData }, { data: reviewData }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/users"),
        api.get("/farm/review/list")
      ]);

      if (myData.role === "member") {
        navigate("/minha-area");
        return;
      }

      setMe(myData);
      setMembers(memberData);
      setReviews(reviewData);
    } catch {
      logout();
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-shell">
      <header className="top-header" id="dashboard">
        <div>
          <div className="brand">CARMESINSFARM</div>
          <h1>Painel administrativo</h1>
          <p className="muted">
            Logado como {me?.characterName || "..."} ({me?.role || "..."})
          </p>
        </div>
        <button className="ghost-btn" onClick={logout}>Sair</button>
      </header>

      <div className="stats">
        <div className="stat"><span>Total</span><strong>{members.length}</strong></div>
        <div className="stat"><span>Admins</span><strong>{members.filter(m => m.role === "admin").length}</strong></div>
        <div className="stat"><span>Membros</span><strong>{members.filter(m => m.role === "member").length}</strong></div>
        <div className="stat"><span>Envios hoje</span><strong>{reviews.length}</strong></div>
      </div>

      <CreateMemberForm onSuccess={loadData} />
      <MembersList members={members} />
      <FarmReviewList items={reviews} onReload={loadData} />
      <BottomNav admin />
    </div>
  );
}
