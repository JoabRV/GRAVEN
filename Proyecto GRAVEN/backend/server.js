const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db"); // Importamos la conexión a la base de datos

const app = express();
app.use(cors());
app.use(express.json()); // Para leer JSON en las peticiones

// Importar rutas
const taskRoutes = require("./routes/tasks");

// Usar rutas
app.use("/tasks", taskRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Verificar conexión a la base de datos
app.get("/check-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1"); // Consulta simple para verificar la conexión
    res.status(200).json({ message: "Conexión a la base de datos exitosa!" });
  } catch (err) {
    console.error("Error de conexión a la base de datos:", err);
    res.status(500).json({ message: "Error de conexión a la base de datos", error: err.message });
  }
});

// Ruta para agregar tarea
app.post("/add-task", async (req, res) => {
  const { name, status } = req.body; // Asumiendo que envías nombre y estado de la tarea

  if (!name) {
    return res.status(400).json({ message: "El nombre de la tarea es obligatorio" });
  }

  try {
    const [result] = await db.query("INSERT INTO tasks (name, status) VALUES (?, ?)", [name, status || 0]);
    res.status(200).json({ message: "Tarea agregada correctamente", taskId: result.insertId });
  } catch (err) {
    console.error("Error al insertar tarea:", err);
    res.status(500).json({ message: "Error al agregar tarea", error: err.message });
  }
});

// Ruta para obtener todas las tareas
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks");
    res.status(200).json(rows); // Retorna todas las tareas
  } catch (err) {
    console.error("Error al obtener tareas:", err);
    res.status(500).json({ message: "Error al obtener tareas", error: err.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
