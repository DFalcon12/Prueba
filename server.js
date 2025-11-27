const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json()); // Permite leer JSON en requests


let tasks = [];

// Validacion
function validateTask(req, res, next) {
  const { titulo, descripcion, estado } = req.body;

  if (!titulo || typeof titulo !== "string") {
    return res.status(400).json({ error: "El campo 'titulo' es obligatorio y debe ser texto." });
  }

  if (!descripcion || typeof descripcion !== "string") {
    return res.status(400).json({ error: "El campo 'descripcion' es obligatorio y debe ser texto." });
  }

  const estadosValidos = ["pendiente", "en_progreso", "completada"];
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: "El campo 'estado' debe ser: pendiente, en_progreso o completada."
    });
  }

  next(); 
}


// RUTAS CRUD
// CREATE - Crear una tarea
app.post("/tasks", validateTask, (req, res) => {
  const { titulo, descripcion, estado } = req.body;

  const newTask = {
    id: uuidv4(),
    titulo,
    descripcion,
    estado
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// READ - Obtener todas las tareas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// READ - Obtener tarea por ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(task);
});

// UPDATE - Actualizar tarea
app.put("/tasks/:id", validateTask, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

  res.json(tasks[taskIndex]);
});

// DELETE - Eliminar tarea
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const deleted = tasks.splice(taskIndex, 1);

  res.json({ mensaje: "Tarea eliminada", tarea: deleted[0] });
});


// INICIAR SERVIDOR
app.listen(3000, () => {
  console.log("API ejecutandose en http://localhost:3000");
});
