const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Helper: format mongoose validation errors into a clean object
const formatValidationError = (err) => {
  const errors = {};
  for (const field in err.errors) {
    errors[field] = err.errors[field].message;
  }
  return errors;
};

// GET /api/tasks - get all tasks (supports ?status=&priority=&sort=)
router.get("/", async (req, res) => {
  try {
    const { status, priority, sort } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter);

    if (sort === "oldest") query = query.sort({ createdAt: 1 });
    else if (sort === "dueDate") query = query.sort({ dueDate: 1 });
    else query = query.sort({ createdAt: -1 }); // newest first by default

    const tasks = await query.exec();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error while fetching tasks" });
  }
});

// GET /api/tasks/:id - get single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/tasks - create task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, errors: formatValidationError(err) });
    }
    res.status(500).json({ success: false, message: "Server error while creating task" });
  }
});

// PUT /api/tasks/:id - update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, errors: formatValidationError(err) });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error while updating task" });
  }
});

// DELETE /api/tasks/:id - delete task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error while deleting task" });
  }
});

module.exports = router;
