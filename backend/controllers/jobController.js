const JobRequest = require("../models/JobRequest");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// @desc    Get all job requests with optional filters and search
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { description: regex }];
  }
  const jobs = await JobRequest.find(query)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Get single job request
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
  const job = await JobRequest.findById(req.params.id).populate(
    "owner",
    "name email",
  );
  if (!job)
    throw new AppError(`Job request not found with id: ${req.params.id}`, 404);
  res.status(200).json({ success: true, data: job });
});

// @desc    Get jobs owned by current user
// @route   GET /api/jobs/mine
// @access  Private
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await JobRequest.find({ owner: req.user._id })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Create a new job request
// @route   POST /api/jobs
// @access  Private — homeowner only
const createJob = asyncHandler(async (req, res) => {
  const { title, description, category, location, contactName, contactEmail } =
    req.body;
  const job = await JobRequest.create({
    title,
    description,
    category,
    location,
    contactName,
    contactEmail,
    owner: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Job request created successfully",
    data: job,
  });
});

// @desc    Update job status
// @route   PATCH /api/jobs/:id
// @access  Private — worker or homeowner
const updateJobStatus = asyncHandler(async (req, res) => {
  const job = await JobRequest.findById(req.params.id);
  if (!job)
    throw new AppError(`Job request not found with id: ${req.params.id}`, 404);

  // Homeowners can only update their own jobs' status
  if (
    req.user.activeRole === "homeowner" &&
    job.owner.toString() !== req.user._id.toString()
  ) {
    throw new AppError("You can only update the status of your own jobs", 403);
  }

  job.status = req.body.status;
  await job.save();
  res.status(200).json({
    success: true,
    message: "Job status updated successfully",
    data: job,
  });
});

// @desc    Delete a job request
// @route   DELETE /api/jobs/:id
// @access  Private — homeowner only (must be owner)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await JobRequest.findById(req.params.id);
  if (!job)
    throw new AppError(`Job request not found with id: ${req.params.id}`, 404);

  // Only homeowners can delete jobs, and only their own
  if (req.user.activeRole !== "homeowner") {
    throw new AppError("Only homeowners can delete job requests", 403);
  }
  if (!job.owner || job.owner.toString() !== req.user._id.toString()) {
    throw new AppError("You can only delete your own job requests", 403);
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job request deleted successfully",
    data: {},
  });
});

module.exports = {
  getJobs,
  getJob,
  getMyJobs,
  createJob,
  updateJobStatus,
  deleteJob,
};
