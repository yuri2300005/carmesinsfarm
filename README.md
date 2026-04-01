# CarmesinsFarm V2

Versão refeita com a lógica pedida:

## Perfis
- **dev**: acesso total
- **admin**: cadastra membros, vê lista, checa farms
- **member**: vê só a própria página e envia farm

## Login principal
- usuário: `devuri`
- senha: `devuri`

## Cadastro
Campos:
- ID
- nome do personagem
- nome de usuário
- senha
- cargo

## Backend
```bash
cd backend
npm install
copy .env.example .env
node server.js
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Observação
O backend cria as tabelas sozinho e também cria o usuário `devuri` automaticamente.
