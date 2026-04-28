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
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL");
});

app.get("/", (req, res) => {
  res.send("🚀 Indigo API is running!");
});

// GET ITEMS
app.get("/items", (req, res) => {
  db.query("SELECT * FROM menu_items", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ADD ITEM
app.post("/items", (req, res) => {
  const { name, price, category } = req.body;

  db.query(
    "INSERT INTO menu_items (name, price, category, stock) VALUES (?, ?, ?, 5)",
    [name, price, category],
    err => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Item added" });
    }
  );
});

// UPDATE ITEM
app.put("/items/:id", (req, res) => {
  const { name, price, category, stock } = req.body;

  db.query(
    "UPDATE menu_items SET name=?, price=?, category=?, stock=? WHERE id=?",
    [name, price, category, stock, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Item updated" });
    }
  );
});

// DELETE ITEM
app.delete("/items/:id", (req, res) => {
  db.query("DELETE FROM menu_items WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Item deleted" });
  });
});

// GET CATEGORIES
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});

// ADD CATEGORY
app.post("/categories", (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    err => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Category added" });
    }
  );
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});