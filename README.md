# i9+ BESS — Sistema de Inventário ESG
**Equipe 05 | Turma 1 | Universidade Positivo**  
Stack: C# (ASP.NET Core) + React (Vite) + MySQL

---

## Pré-requisitos
- .NET 8 SDK → https://dotnet.microsoft.com/download
- Node.js 18+ → https://nodejs.org
- MySQL 8 rodando localmente

---

## 1. Configurar o banco de dados MySQL

Abra o MySQL Workbench (ou o terminal MySQL) e execute:

```sql
-- Rode o arquivo sql/setup.sql
source C:/caminho/do/projeto/i9plus-bess/sql/setup.sql
```

Ou abra o arquivo `sql/setup.sql` no Workbench e execute tudo.

---

## 2. Configurar a senha do MySQL no backend

Abra `backend/appsettings.json` e troque `SUA_SENHA_AQUI` pela sua senha do MySQL:

```json
"DefaultConnection": "Server=localhost;Port=3306;Database=i9plus_bess;User=root;Password=SUASENHA;"
```

---

## 3. Rodar o backend (C#)

Abra um terminal (PowerShell ou CMD) dentro da pasta `backend/`:

```bash
cd i9plus-bess/backend

# Instalar dependências NuGet
dotnet restore

# Rodar a API
dotnet run
```

A API estará em: **http://localhost:5000**

Teste no navegador: http://localhost:5000/api/baterias  
Deve retornar os 3 registros de exemplo em JSON.

---

## 4. Rodar o frontend (React)

Abra **outro terminal** na pasta `frontend/`:

```bash
cd i9plus-bess/frontend

# Instalar dependências npm
npm install

# Iniciar o React
npm run dev
```

O app estará em: **http://localhost:5173**

---

## Endpoints da API

| Método | Rota                   | Descrição              |
|--------|------------------------|------------------------|
| GET    | /api/baterias          | Lista todas as baterias|
| GET    | /api/baterias/{id}     | Busca uma por ID       |
| POST   | /api/baterias          | Cadastra nova bateria  |
| PUT    | /api/baterias/{id}     | Atualiza uma bateria   |
| DELETE | /api/baterias/{id}     | Remove uma bateria     |

---

## Estrutura do projeto

```
i9plus-bess/
├── sql/
│   └── setup.sql              ← Cria o banco e tabela
├── backend/
│   ├── BessApi.csproj
│   ├── Program.cs             ← Endpoints da API
│   ├── appsettings.json       ← Config (string de conexão)
│   ├── Models/
│   │   └── Bateria.cs         ← Modelo de dados
│   └── Data/
│       └── BessContext.cs     ← Entity Framework context
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            ← Roteamento
        ├── api.js             ← Chamadas ao backend
        ├── index.css          ← Estilos globais
        └── pages/
            ├── Listagem.jsx   ← Tela principal com tabela
            └── Cadastro.jsx   ← Formulário de cadastro
```

---

## Problemas comuns

**Erro de CORS:** Certifique-se de que o backend está rodando em `http://localhost:5000` e o frontend em `http://localhost:5173`.

**Erro de conexão com MySQL:** Verifique a senha no `appsettings.json` e se o serviço MySQL está ativo (procure "MySQL" nos Serviços do Windows).

**`dotnet: command not found`:** Reinicie o terminal após instalar o .NET SDK.
