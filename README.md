# 🍽️ Indigo Restaurant Web App

A full-stack restaurant management web app with menu browsing, cart functionality, and persistent stock management using MySQL.

---

## 🚀 Features

* 🧾 View menu items from database
* ➕ Add, edit, delete menu items (CRUD)
* 📦 Persistent stock management (MySQL)
* 🛒 Simple shopping cart system
* 🌙 Dark mode toggle
* 📂 Category filtering (Food / Drinks)

---

## 🛠️ Tech Stack

**Frontend**

* HTML
* CSS
* Vanilla JavaScript

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

---

## 📁 Project Structure

```
INDIGO/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── vanillascript.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/wthkusu/INDIGO
cd Indigo
```

---

### 2. Install backend dependencies

```bash
cd backend
npm install
```

---

### 3. Configure MySQL

Create a database:

```sql
CREATE DATABASE indigo_db;
```

Create table:

```sql
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  category VARCHAR(100),
  stock INT DEFAULT 0
);
```

---

### 4. Update DB credentials in `server.js`

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "indigo_db"
});
```

---

### 5. Run backend

```bash
node server.js
```

Server runs on:
👉 http://localhost:3000

---

### 6. Run frontend

Open:

```
frontend/index.html
```

(using Live Server recommended)

---

## 📡 API Endpoints

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | /items           | Get all items |
| POST   | /items           | Add new item  |
| PUT    | /items/:id       | Update item   |
| DELETE | /items/:id       | Delete item   |
| PUT    | /items/:id/stock | Update stock  |

---

