const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 🔸 Oracle connection settings
const dbConfig = {
  user: "system",             
  password: "sqldbms",
  connectString: "localhost:1521/XE" 
};


app.use(express.static(path.join(__dirname)));

// --- API routes ---

// GET all products
app.get("/api/products", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT * FROM products`);
    res.json(
      result.rows.map((r) => ({
        id: r[0],
        name: r[1],
        category: r[2],
        price: r[3],
        stock: r[4],
      }))
    );
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// POST new product
app.post("/api/products", async (req, res) => {
  let conn;
  try {
    const { name, category, price, stock } = req.body;
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `INSERT INTO products (name, category, price, stock)
       VALUES (:name, :category, :price, :stock)
       RETURNING id INTO :id`,
      {
        name,
        category,
        price,
        stock,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], ...req.body });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `DELETE FROM products WHERE id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Fallback for SPA routes - serve index.html from repo root
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Oracle backend + frontend running at http://localhost:${PORT}`)
);

