import { Link } from "react-router-dom";

export default function BottomNav({ admin }) {
  return (
    <nav className="bottom-nav">
      {admin ? (
        <>
          <a href="#dashboard">Dashboard</a>
          <a href="#cadastro">Cadastrar membro</a>
          <a href="#gerenciar">Gerenciar membros</a>
          <a href="#farms">Checar farms</a>
        </>
      ) : (
        <>
          <Link to="/minha-area">Minha página</Link>
          <a href="#enviar-farm">Enviar farm</a>
          <a href="#historico">Meus envios</a>
        </>
      )}
    </nav>
  );
}
