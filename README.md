# 🇧🇷 FluentIA 🇺🇸

Este projeto é uma plataforma completa para o ensino de inglês, utilizando Inteligência Artificial para adaptar o conteúdo conforme o nível do usuário. A aplicação foi desenvolvida com **Node.js** no backend, **React** no frontend e **PostgreSQL** para o banco de dados relacional.

## Tecnologias Utilizadas

- Backend: **Node.js**
- Frontend: **React.js**
- Banco de Dados: **PostgreSQL**
- IA: **Groq API**
- Autenticação: Sessões seguras e criptografia de credenciais
- Design Responsivo e Clean

---

## Funcionalidades

### Autenticação
- Login e cadastro de usuários com armazenamento seguro de credenciais (criptografia).
- Sistema de sessão com expiração após 2 horas para maior segurança.

### Teste de Nivelamento
- Ao primeiro acesso, o usuário realiza um teste para definir seu nível de inglês:
  - 🟢 Básico (20%)
  - 🟡 Intermediário (50%)
  - 🔴 Avançado (100%)

### Aulas Interativas
- Aulas personalizadas com textos explicativos em português.
- Exercícios e atividades de acordo com o nível do usuário.
- Recomendação de livros ou links úteis ao final de cada aula.

### Testes Pós-Aula
- Após cada aula, o usuário realiza um teste de 10 questões com limite de 50 minutos.
- Respostas enviadas dentro do prazo são registradas; questões não respondidas são desconsideradas após o tempo expirar.

### Chat com IA
- Área exclusiva para prática de conversação com IA em inglês.
- Correção de escrita e explicação de erros em tempo real.

### Painel de Progresso
- Registro de aulas concluídas, acertos em testes, histórico de progresso e avanços no idioma.

### Responsividade e UX
- Interface moderna, responsiva e amigável, com uso de imagens para melhor experiência de aprendizado.

---

## Organização do Banco de Dados

O banco de dados relacional PostgreSQL é estruturado com tabelas interligadas:
- **Usuários:** Dados pessoais, credenciais criptografadas e progresso.
- **Aulas:** Conteúdo, textos, materiais recomendados.
- **Testes:** Histórico de desempenho do usuário.
- **Mensagens IA:** Apenas em tempo real (não persistente).

---

## Segurança

- Armazenamento seguro de informações sensíveis.
- Uso de variáveis de ambiente para esconder chaves de API e credenciais do banco de dados.
- Sessões autenticadas e limitadas a 2 horas.

---

## Como Rodar o Projeto

### Backend
```bash
cd backend
npm install
npm run dev 
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Configuração
Crie um arquivo .env no backend com:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_DATABASE=sua_database

JWT_SECRET=chave_segura
JWT_EXPIRES_IN=2h

GROQ_API_KEY=sua_api_groq

PORT=5000
```

## Visual do projeto

Aula feita por IA, com base no conhecimento do aluno.
![Aula feita com IA](https://images2.imgbox.com/41/fb/HErN2tH4_o.png)

Dashboard amigável.
![Dashboard](https://images2.imgbox.com/19/8c/6IQRjPKj_o.png)

Aula finalizada após o usuário terminar as 10 questões em 50 minutos.
![Finalização de aula](https://images2.imgbox.com/f9/da/mrIYG9as_o.png)

## Contato

- **Guilherme Nabor** - [@GuilhermesNabor](https://github.com/GuilhermesNabor)
- **Email**: guilhermenabor@outlook.com.br