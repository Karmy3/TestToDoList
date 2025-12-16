const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ name: 1 });
    res.json(tasks);
  } catch (err) { 
    res.status(500).json({ message: "Error fetching tasks" }); 
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Error creating task" });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: req.body.status }, 
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
});

module.exports = router;