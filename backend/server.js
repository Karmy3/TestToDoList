require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 1. Middlewares de base
app.use(cors());
app.use(express.json());

// 2. Connexion DB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todolist";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// 3. Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));