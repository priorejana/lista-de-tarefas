const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
});

app.post('/api/tasks', 
  [body('title').trim().notEmpty().withMessage('O título é obrigatório.')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
        [title]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao cadastrar tarefa.' });
    }
  }
);

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar tarefa.' });
  }
});

app.delete('/api/tasks/completed/all', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE completed = true');
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao limpar tarefas concluídas.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));