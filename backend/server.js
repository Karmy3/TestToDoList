const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
