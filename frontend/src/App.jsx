import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import MemberPage from "./pages/MemberPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("cf_token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><AdminPage /></RequireAuth>} />
      <Route path="/minha-area" element={<RequireAuth><MemberPage /></RequireAuth>} />
      <Route path="/membros/:id" element={<RequireAuth><MemberDetailsPage /></RequireAuth>} />
    </Routes>
  );
}
