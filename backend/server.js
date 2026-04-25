const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "My$ql1205", 
  database: "indigo_db"
});

db.connect(err => {
  if (err) {
    console.error(" MySQL connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
  res.send("🚀 Indigo API is running!");
});

// GET ALL ITEMS
app.get("/items", (req, res) => {
  db.query("SELECT * FROM menu_items", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// CREATE ITEM (WITH STOCK)
app.post("/items", (req, res) => {
  const { name, price, category, stock } = req.body;

  const sql = `
    INSERT INTO menu_items (name, price, category, stock)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, price, category, stock || 5], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Insert failed" });
    }
    res.json({ message: "✅ Item added" });
  });
});

// UPDATE ITEM (WITH STOCK)
app.put("/items/:id", (req, res) => {
  const { name, price, category, stock } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE menu_items
    SET name=?, price=?, category=?, stock=?
    WHERE id=?
  `;

  db.query(sql, [name, price, category, stock, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Update failed" });
    }
    res.json({ message: "✏️ Item updated" });
  });
});

// UPDATE STOCK ONLY
app.put("/items/:id/stock", (req, res) => {
  const { stock } = req.body;
  const { id } = req.params;

  const sql = "UPDATE menu_items SET stock=? WHERE id=?";

  db.query(sql, [stock, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Stock update failed" });
    }
    res.json({ message: "📦 Stock updated" });
  });
});

// DELETE ITEM
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM menu_items WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ message: "🗑️ Item deleted" });
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});