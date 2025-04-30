const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

let tasks = [];
let idCounter = 1;

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.use(express.static("public"));

// POST new task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }
  const newTask = { id: idCounter++, title, description, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task (complete/incomplete)
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  res.json(task);
});

// DELETE a task
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  const deleted = tasks.splice(index, 1);
  res.json(deleted[0]);
});

app.get("/", (req, res) => {
  res.send("Task Management API is running. Use /tasks to interact.");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
