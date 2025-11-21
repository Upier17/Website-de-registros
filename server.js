import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración básica
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Error al conectar:", err);
  else console.log("Base de datos conectada");
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  edad INTEGER,
  ciudad TEXT
)`);

// --- Rutas CRUD ---

// Consultar todos
app.get("/api/personas", (req, res) => {
  db.all("SELECT * FROM personas", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Consultar individual
app.get("/api/personas/:id", (req, res) => {
  db.get("SELECT * FROM personas WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json(row);
  });
});

// Agregar
app.post("/api/personas", (req, res) => {
  const { nombre, edad, ciudad } = req.body;
  db.run("INSERT INTO personas (nombre, edad, ciudad) VALUES (?, ?, ?)",
    [nombre, edad, ciudad],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID, nombre, edad, ciudad });
    });
});

// Editar
app.put("/api/personas/:id", (req, res) => {
  const { nombre, edad, ciudad } = req.body;
  db.run(
    "UPDATE personas SET nombre=?, edad=?, ciudad=? WHERE id=?",
    [nombre, edad, ciudad, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: req.params.id, nombre, edad, ciudad });
    }
  );
});

// Eliminar
app.delete("/api/personas/:id", (req, res) => {
  db.run("DELETE FROM personas WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ message: "Registro eliminado" });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
