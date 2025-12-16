const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: Boolean, default: false } // false = non terminée
});

module.exports = mongoose.model("Task", taskSchema);