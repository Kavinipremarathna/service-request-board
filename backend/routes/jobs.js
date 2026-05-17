const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJob,
  getMyJobs,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");
const {
  validateCreateJob,
  validateUpdateStatus,
} = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

// Public — anyone can browse
router.get("/", getJobs);
// Authenticated user's jobs
router.get("/mine", protect, getMyJobs);
router.get("/:id", getJob);

// Homeowner only — post a job
router.post("/", protect, authorize("homeowner"), validateCreateJob, createJob);

// Worker or homeowner — update job status
router.patch(
  "/:id",
  protect,
  authorize("worker", "homeowner"),
  validateUpdateStatus,
  updateJobStatus,
);

// Homeowner only — delete own job
router.delete("/:id", protect, authorize("homeowner"), deleteJob);

module.exports = router;
