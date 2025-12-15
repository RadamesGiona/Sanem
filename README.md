# 🤝 SANEM – Sistema Solidário de Doações

> **UTFPR – Oficina de Desenvolvimento de Software**

Sistema solidário completo para gerenciamento de doações, conectando doadores e beneficiários através de uma plataforma moderna e intuitiva.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Executar](#-como-executar)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Endpoints](#-endpoints)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre o Projeto

O **SANEM** é uma plataforma desenvolvida para facilitar o processo de doações, oferecendo um sistema completo de cadastro, gerenciamento e distribuição de itens doados. O projeto foi desenvolvido como parte da Oficina de Desenvolvimento de Software da UTFPR.

---

## ✨ Funcionalidades

### Para Doadores
- 📝 Cadastro e autenticação de usuários
- 📦 Cadastro de itens para doação
- 📸 Upload de fotos dos itens
- 📊 Acompanhamento de doações

### Para Funcionários
- 👥 Gerenciamento de usuários
- 🎁 Gestão de doações recebidas
- 📋 Reserva e distribuição de itens
- 📈 Painéis administrativos

### Técnicas
- 🔐 Autenticação JWT
- 📁 Armazenamento de imagens (MinIO)
- 🔄 API REST completa
- 📱 Interface mobile responsiva

---

## 🛠 Tecnologias

### Frontend
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Ferramentas
- **MinIO** - Armazenamento de arquivos
- **TypeORM** - ORM para banco de dados
- **Swagger** - Documentação da API
- **Docker Compose** - Orquestração de containers

---

## 🏗 Arquitetura

```
┌─────────────────┐
│  React Native   │  ← Frontend Mobile
│     (Expo)      │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│     NestJS      │  ← Backend API
│   (TypeScript)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ MinIO │ │ Postgres │
└───────┘ └─────────┘
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js** (versão 18+ LTS) - [Download](https://nodejs.org/)
- ✅ **npm** ou **yarn**
- ✅ **Docker** + **Docker Compose** - [Download](https://www.docker.com/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Expo Go** (app no celular) ou **Android Studio** (para emulador)

### Verificar instalações

```bash
node -v        # deve mostrar v18.x ou superior
npm -v         # deve mostrar 9.x ou superior
docker -v      # deve mostrar a versão do Docker
git --version  # deve mostrar a versão do Git
```

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/RadamesGiona/Sanem.git
cd Sanem
```

### 2. Estrutura de pastas

```
Sanem/
├── frontend/          # Aplicação React Native
├── backend/           # API NestJS + Docker
│   ├── src/
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md
```

---

## 🚀 Como Executar

### Backend (Docker - Recomendado)

O Docker irá inicializar automaticamente:
- ✅ PostgreSQL
- ✅ MinIO
- ✅ API NestJS
- ✅ Migrations do banco

```bash
cd backend
docker-compose up --build
```

> ⏱️ **Primeira execução:** pode levar alguns minutos para baixar as imagens Docker

### Backend (Desenvolvimento Local - Opcional)

```bash
cd backend
npm install
npm run start:dev
```

> ⚠️ **Atenção:** Certifique-se de que PostgreSQL e MinIO estejam rodando localmente

---

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Após iniciar, você verá um QR Code no terminal. Escolha uma opção:

- 📱 **Celular:** Escaneie o QR Code com o app Expo Go
- 🤖 **Android:** Pressione `a` para abrir no emulador
- 🍎 **iOS:** Pressione `i` para abrir no simulador (apenas macOS)
- 🌐 **Web:** Pressione `w` para abrir no navegador

---

## ⚙️ Configuração

### Variáveis de Ambiente - Backend

Crie um arquivo `.env` na pasta `backend/`:

```env
# Banco de Dados
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=solidarios_db

# MinIO
MINIO_ENDPOINT=minio
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=supersecret
MINIO_BUCKET_NAME=solidarios

# API
PORT=3000
JWT_SECRET=seu_secret_jwt_aqui
```

### Variáveis de Ambiente - Frontend

Crie um arquivo `.env` na pasta `frontend/`:

```env
API_URL=http://localhost:3000
```

> 💡 **Dica:** Para testar no celular físico, substitua `localhost` pelo IP da sua máquina na rede local

---

## 🔗 Endpoints

Após iniciar os serviços:

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **API NestJS** | http://localhost:3000 | - |
| **Swagger (Docs)** | http://localhost:3000/api | - |
| **MinIO Console** | http://localhost:9001 | `admin` / `supersecret` |
| **PostgreSQL** | localhost:5432 | `postgres` / `postgres` |

### Testando a API

```bash
# Verificar se a API está online
curl http://localhost:3000/health

# Ver documentação interativa
# Acesse: http://localhost:3000/api
```

---

## 📂 Estrutura do Projeto

### Backend

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticação JWT
│   │   ├── users/         # Gerenciamento de usuários
│   │   ├── items/         # Itens para doação
│   │   ├── donations/     # Doações
│   │   └── shared/        # Utilitários compartilhados
│   ├── database/
│   │   ├── migrations/    # Versionamento do banco
│   │   └── entities/      # Entidades TypeORM
│   ├── config/            # Configurações
│   ├── main.ts            # Bootstrap da aplicação
│   └── app.module.ts      # Módulo principal
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── screens/           # Telas da aplicação
│   ├── components/        # Componentes reutilizáveis
│   ├── services/          # Comunicação com API
│   ├── context/           # Gerenciamento de estado
│   ├── navigation/        # Rotas de navegação
│   ├── utils/             # Funções auxiliares
│   └── types/             # Tipos TypeScript
├── assets/                # Imagens e recursos
├── App.tsx                # Componente raiz
└── package.json
```

---

## 🗄️ Banco de Dados

### Configuração Padrão

| Propriedade | Valor |
|-------------|-------|
| Host | localhost |
| Porta | 5432 |
| Usuário | postgres |
| Senha | postgres |
| Banco | solidarios_db |

### Migrations

As migrations são executadas automaticamente ao iniciar o Docker.

**Localização:** `backend/src/database/migrations/`

**Comandos úteis:**

```bash
# Gerar nova migration
npm run migration:generate -- NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

---

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e
```

### Frontend

```bash
cd frontend

# Testes (quando configurado)
npm test
```

---

## 🐛 Troubleshooting

### Erro: "Port already in use"

```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro: Docker não inicia

```bash
# Limpar containers e volumes
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Erro: Expo não conecta no celular

1. Certifique-se de que o celular e o PC estão na **mesma rede Wi-Fi**
2. Desative firewalls temporariamente
3. Use o modo **Tunnel** ao invés de **LAN**:
   ```bash
   npx expo start --tunnel
   ```

---

## 👥 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é desenvolvido como parte da Oficina de Desenvolvimento de Software da UTFPR.

---

## 📧 Contato

**UTFPR** - Universidade Tecnológica Federal do Paraná

🔗 GitHub: [RadamesGiona/Sanem](https://github.com/RadamesGiona/Sanem)

---

<div align="center">
  
**Desenvolvido com ❤️ pela equipe SANEM**

</div>
