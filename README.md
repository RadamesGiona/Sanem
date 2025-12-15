SANEM – Sistema Solidário de Doações
UTFPR – Oficina de Desenvolvimento de Software

README — Guia Completo de Instalação e Execução 

1. Visão Geral do Projeto
O SANEM é um sistema solidário voltado ao gerenciamento de doações.
Inclui funcionalidades de:
•	Cadastro e gerenciamento de usuários
•	Cadastro de doações
•	Reserva e distribuição de itens
•	Upload de imagens via MinIO
•	Consumo de API REST
•	Painéis e telas para doadores e funcionários
A arquitetura é dividida em:
•	Front-end: React Native (Expo)
•	Back-end: NestJS
•	Banco de Dados: PostgreSQL
•	Armazenamento de arquivos: MinIO
•	Orquestração: Docker
•	Versionamento DB: Migrations

2. 📁 Estrutura Geral do Repositório
/Sanem
│
├── /frontend     → Aplicação mobile (React Native)
│
├── /backend      → API, banco, migrations e Docker
│   ├── src
│   ├── docker-compose.yml
│   └── Dockerfile
│
└── README.md

3. 🚀 Pré-requisitos
Antes de iniciar, instale:
•	Node.js (versão LTS 18+)
•	NPM ou Yarn
•	Docker + Docker Compose
•	Git
•	Expo Go 
•	Android Studio (para emuladores)

4. Como Rodar o Projeto
Abaixo, o passo a passo completo para iniciar toda a aplicação.

4.1 Clonar o Repositório
git clone https://github.com/RadamesGiona/Sanem.git
cd Sanem

4.2 Inicializar Back-end + Banco + MinIO, a forma recomendada é via docker:

1.	Acesse a pasta do back-end:
cd backend
3.	Execute o Docker Compose:
docker-compose up --build
5.	O Docker irá criar automaticamente:
o	Container PostgreSQL
o	Container MinIO
o	Container NestJS (API)
6.	As migrations serão executadas automaticamente ao subir o back-end.

4.3 Endpoints e Serviços
Após subir o ambiente:
API (NestJS)
http://localhost:3000
Swagger (Documentação da API)
http://localhost:3000/api
MinIO (Interface Web)
http://localhost:9001
Credenciais:
Usuário: admin
Senha: supersecret

4.4 Executar o Front-end (React Native)
1.	Abra um terminal e vá para:
cd frontend
3.	Instale as dependências:
npm install
7.	Inicie o projeto:
npx expo start
9.	O Expo abrirá no navegador.
Escolha:
o	Run on Android
o	Run on iOS
o	Scan QR Code (rodar no celular)

5. Banco de Dados
Configuração usada no Docker:
Host: localhost
Porta: 5432
Usuário: postgres
Senha: postgres
Banco: solidarios_db
Local das migrations:
backend/src/database/migrations
As migrations criam todas as tabelas automaticamente ao rodar o Docker.

6. Estrutura do Back-end 
/backend/src
│
├── modules/
│   ├── items/        → módulo de itens
│   ├── users/        → módulo de usuários
│   ├── auth/         → autenticação
│   ├── donations/    → doações
│   └── shared/       → utilidades
│
├── database/
│   ├── migrations    → versionamento do banco
│   └── entities      → entidades ORM
│
├── main.ts           → bootstrap do NestJS
└── app.module.ts     → módulo principal

7. Estrutura do Front-end (Resumo para continuação)
/frontend
│
├── src/
│   ├── services/       → consumo da API
│   ├── screens/        → telas
│   ├── components/     → componentes globais
│   ├── context/        → autenticação e estado global
│   └── utils/          → funções auxiliares
│
├── App.tsx             → entrada da aplicação


8. 🔑 Variáveis de Ambiente
Back-end
Arquivo .env esperado (utilize como exemplo):
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=solidarios_db

MINIO_ENDPOINT=minio
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=supersecret
MINIO_BUCKET_NAME=solidarios

PORT=3000
Front-end (caso necessário)
Criar .env:
API_URL=http://localhost:3000
