const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// CREATE
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// READ only non-terminées
router.get("/pending", async (req, res) => {
  const tasks = await Task.find({ status: false });
  res.json(tasks);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// ADVANCED: tri par nom
router.get("/sorted", async (req, res) => {
  const tasks = await Task.find().sort({ name: 1 });
  res.json(tasks);
});

// ADVANCED: compter
router.get("/count", async (req, res) => {
  const count = await Task.countDocuments();
  res.json({ total: count });
});

module.exports = router;
