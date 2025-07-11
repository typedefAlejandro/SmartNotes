# 📝 Smart Notes

Um sistema simples e elegante para gerenciar suas anotações pessoais, com controle de acesso e histórico de login.

## ✨ Funcionalidades

- **📝 Gerenciamento de Notas**: Crie, edite e delete suas anotações
- **🔐 Autenticação Segura**: Login e registro com validações
- **🌍 Histórico de Acessos**: Veja onde e quando acessou sua conta
- **🎨 Interface Limpa**: Design moderno e responsivo

## 🚀 Como Usar

### Pré-requisitos
- Node.js (versão 18+)
- Java 17+
- PostgreSQL

### Backend (Java/Spring)
```bash
cd backend
# Configure o banco PostgreSQL em application.properties
./mvnw spring-boot:run
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000

## 🛠️ Tecnologias

**Backend:**
- Spring Boot
- Spring Security + JWT
- PostgreSQL
- Geolocalização via ipinfo.io

**Frontend:**
- Next.js 14
- React
- TypeScript
- CSS Modules

## 📱 Telas

- **Login/Registro**: Autenticação com validações
- **Dashboard**: Lista todas as suas notas
- **Nova Nota**: Crie anotações rapidamente
- **Editar Nota**: Modifique suas anotações
- **Histórico**: Veja seus acessos por localização

## 🔧 Configuração

1. Clone o repositório
2. Configure o PostgreSQL
3. Ajuste as credenciais em `backend/src/main/resources/application.properties`
4. Execute backend e frontend
5. Registre-se e comece a usar!

---

Feito com ❤️ para organizar ideias de forma simples e segura. 