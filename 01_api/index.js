const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'itemdb',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// health check (เหมือนในสไลด์)
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (e) {
    console.error("DB ERROR:", e);  // <-- เพิ่มตรงนี้เพื่อดู error จริง
    res.status(500).json({ status: "error", message: e.message }); // <-- ส่ง error กลับไปด้วย
  }
});

// GET all items
app.get('/items', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM items");
  res.json(rows);
});

// POST create item
app.post('/items', async (req, res) => {
  const { name, description, price, quantity } = req.body;
  await pool.query(
    "INSERT INTO items (name, description, price, quantity) VALUES (?,?,?,?)",
    [name, description, price, quantity]
  );
  res.json({ message: "created" });
});

// PUT update
app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, price, quantity } = req.body;
  await pool.query(
    "UPDATE items SET name=?, description=?, price=?, quantity=? WHERE id=?",
    [name, description, price, quantity, id]
  );
  res.json({ message: "updated" });
});

// DELETE
app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM items WHERE id=?", [id]);
  res.json({ message: "deleted" });
});

const port = Number(process.env.API_PORT || 3001);
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`)
);
