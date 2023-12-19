const mongoose = require("mongoose");

// Define the Task schema
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["todo", "done"], // Possible task statuses
    default: "todo", // Default status if not provided
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  username: {
    type: String,
  },
});

// Create a Task model based on the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
