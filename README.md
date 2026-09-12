# 📝 Full-Stack To-Do List Application

> Aplicação web para cadastro, gerenciamento e consulta de tarefas em tempo real com persistência em banco de dados relacional na nuvem.

🔗 **Link da Aplicação (Live Demo):** https://priorejana.github.io/lista-de-tarefas/ \
⚙️ **API RESTful (Backend):** https://lista-de-tarefas-3op7.onrender.com/api/tasks

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+ / Fetch API)
- **Backend:** Node.js, Express.js, CORS, Express-Validator, Dotenv
- **Banco de Dados:** PostgreSQL (Hospedado na nuvem via Supabase)
- **Deploy & Hospedagem:** GitHub Pages (Frontend) & Render.com (Backend)

---

## 🛠️ Arquitetura e Engenharia de Software

A aplicação adota uma arquitetura Cliente-Servidor (Full-Stack) desacoplada e baseada em boas práticas de mercado:

* **Frontend (SPA):** Consome a API RESTful de forma assíncrona utilizando `async/await` e a `Fetch API`, garantindo atualização dinâmica da interface sem recarregamento da página.
* **Backend (API RESTful):** Desenvolvido em Node.js/Express, responsável pela camada de regras de negócio, roteamento HTTP, sanitização de inputs e envio de respostas estruturadas em formato JSON.
* **Camada de Dados:** Conexão com banco PostgreSQL remoto configurada com Connection Pooling (`pg.Pool`) e suporte a criptografia TLS/SSL para garantir alta disponibilidade e integridade das conexões.
* **Segurança:** Prevenção contra ataques de *SQL Injection* por meio de consultas parametrizadas (`$1`, `$2`) e validação severa de dados de entrada via middleware (`express-validator`).

---

## 📊 Análise de Requisitos

### Requisitos Funcionais (RF)
- **[RF01] Cadastrar Registro:** O sistema deve permitir a adição de novas tarefas validando obrigatoriedade do título.
- **[RF02] Consultar Registros:** O sistema deve recuperar e exibir todas as tarefas gravadas no banco de dados.
- **[RF03] Atualizar Status:** O sistema deve permitir alterar o estado de uma tarefa entre pendente e concluída.
- **[RF04] Filtrar Exibição:** O sistema deve permitir filtrar visualmente as tarefas por status (Todas, Pendentes e Concluídas).
- **[RF05] Remover Registros:** O sistema deve permitir a remoção de tarefas individuais ou a exclusão em massa das tarefas já concluídas.

### Requisitos Não Funcionais (RNF)
- **[RNF01] Persistência:** Os dados devem ser armazenados de forma permanente em banco de dados relacional.
- **[RNF02] Segurança de Credenciais:** Nenhuma credencial ou string de conexão do banco deve ser exposta no repositório público (uso de arquivo `.env` e variáveis de ambiente em produção).
- **[RNF03] Validação no Servidor:** O servidor deve rejeitar requisições inválidas e retornar códigos de status HTTP semanticamente adequados (`400 Bad Request`, `500 Internal Server Error`).
- **[RNF04] Interface Adaptável:** O layout deve ser responsivo e acessível em diferentes tamanhos de tela (desktop e mobile).

---

## 🔌 Documentação da API (Endpoints RESTful)

| Método | Rota | Descrição | Status HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retorna a lista de todas as tarefas cadastradas | `200 OK` |
| `POST` | `/api/tasks` | Cadastra uma nova tarefa no banco (`body: { title }`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/tasks/:id` | Atualiza o estado da tarefa (`body: { completed }`) | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Remove uma tarefa específica pelo ID | `204 No Content` |
| `DELETE` | `/api/tasks/completed/all` | Remove todas as tarefas com status concluído | `204 No Content` |

---

## 🗄️ Modelagem do Banco de Dados

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
