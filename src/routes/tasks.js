const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  tasksController.getAllTasks
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  tasksController.createTask
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  tasksController.updateTask
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  tasksController.deleteTask
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  tasksController.getUserProfile
);

module.exports = router;
