import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a PostgreSQL (Railway te dará DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Crear tabla si no existe
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personas (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        edad INTEGER,
        ciudad TEXT
      )
    `);
    console.log("Tabla verificada");
  } catch (error) {
    console.error("Error creando tabla:", error);
  }
})();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- Rutas CRUD ---

// Consultar todos
app.get("/api/personas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Consultar individual
app.get("/api/personas/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personas WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Agregar
app.post("/api/personas", async (req, res) => {
  try {
    const { nombre, edad, ciudad } = req.body;
    const result = await pool.query(
      "INSERT INTO personas (nombre, edad, ciudad) VALUES ($1, $2, $3) RETURNING *",
      [nombre, edad, ciudad]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Editar
app.put("/api/personas/:id", async (req, res) => {
  try {
    const { nombre, edad, ciudad } = req.body;
    const result = await pool.query(
      "UPDATE personas SET nombre=$1, edad=$2, ciudad=$3 WHERE id=$4 RETURNING *",
      [nombre, edad, ciudad, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Eliminar
app.delete("/api/personas/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM personas WHERE id=$1", [req.params.id]);
    res.json({ message: "Registro eliminado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Levantar servidor
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)
);
