const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require("../controllers/jobs");

//****** Sets up routes and their corresponding route handlers for the jobs API.  ******

// Route for creating a new job
router
  .route("/")
  .post(createJob)
  .get(getAllJobs);
// Route for getting, updating, and deleting a specific job
router
  .route("/:id")
  .get(getJob)
  .delete(deleteJob)
  .patch(updateJob);

module.exports = router;
