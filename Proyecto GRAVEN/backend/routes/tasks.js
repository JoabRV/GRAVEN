const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todas las tareas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tareas", details: err });
  }
});

// Agregar una nueva tarea
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "El nombre de la tarea es requerido" });
    }
    const [result] = await db.query("INSERT INTO tasks (name, status) VALUES (?, ?)", [name, 0]); // estado 0 = no completada
    res.json({ id: result.insertId, name, status: 0 });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar tarea", details: err });
  }
});

// Marcar tarea como completada/no completada
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
      return res.status(400).json({ error: "El estado debe ser 0 (no completada) o 1 (completada)" });
    }

    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (task.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    res.json({ id, status });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar tarea", details: err });
  }
});

// Eliminar tarea
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (task.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar tarea", details: err });
  }
});

module.exports = router;
