const Task = require("../models/Task"); // Import the Task model
const User = require("../models/User");

async function getAllTasks(req, res) {
  try {
    const { _id } = req.user; // Extract _id from the authenticated user

    const tasks = await Task.find({ user: _id });

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found for this user" });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createTask(req, res) {
  const { task } = req.body;
  const { _id, name } = req.user; // Extract _id from the authenticated user
  try {
    const newTask = new Task({
      task,
      user: _id, // Associate the task with the user by including the _id field
      username: name,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTask(req, res) {
  const { id: taskId } = req.params;
  const updates = req.body;
  const { _id } = req.user; // Extract _id from the authenticated user

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: _id },
      updates,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message:
          "Task not found or you do not have permission to update this task",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteTask(req, res) {
  const { id: taskId } = req.params;
  const { _id } = req.user; // Extract _id from the authenticated user

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: _id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message:
          "Task not found or you do not have permission to delete this task",
      });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controller function to get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in the request object

    // Fetch the user's profile from the database based on their ID
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json(userProfile); // Respond with the user's profile data
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserProfile,
};
