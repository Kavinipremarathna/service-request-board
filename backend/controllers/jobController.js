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
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });
  // Remove contactNumber from jobs unless the job is not Open (i.e., confirmed)
  // or the requester is the owner.
  const sanitized = jobs.map((j) => {
    const obj = j.toObject();
    const isOwner =
      req.user &&
      obj.owner &&
      obj.owner._id &&
      req.user._id === obj.owner._id.toString();
    if (!isOwner && obj.status === "Open") {
      delete obj.contactNumber;
    }
    return obj;
  });

  res
    .status(200)
    .json({ success: true, count: sanitized.length, data: sanitized });
});

// @desc    Get single job request
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
  const jobDoc = await JobRequest.findById(req.params.id)
    .populate("owner", "name email")
    .populate("assignedTo", "name email");
  const job = jobDoc ? jobDoc.toObject() : null;
  if (!job)
    throw new AppError(`Job request not found with id: ${req.params.id}`, 404);
  const isOwner =
    req.user &&
    job.owner &&
    job.owner._id &&
    req.user._id === job.owner._id.toString();
  if (!isOwner && job.status === "Open") {
    delete job.contactNumber;
  }
  res.status(200).json({ success: true, data: job });
});

// @desc    Get jobs owned by current user
// @route   GET /api/jobs/mine
// @access  Private
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await JobRequest.find({ owner: req.user._id })
    .populate("owner", "name email")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });
  // Owner may always see contactNumber
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

// @desc    Create a new job request
// @route   POST /api/jobs
// @access  Private — homeowner only
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    contactName,
    contactEmail,
    contactNumber,
  } = req.body;
  const job = await JobRequest.create({
    title,
    description,
    category,
    location,
    contactName,
    contactEmail,
    contactNumber,
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
  const newStatus = req.body.status;

  // If a worker is accepting the job, perform an atomic update to avoid race conditions
  if (newStatus === "In Progress" && req.user.activeRole === "worker") {
    // Attempt to set status to In Progress and assignedTo only if job is still Open
    const updated = await JobRequest.findOneAndUpdate(
      { _id: req.params.id, status: "Open" },
      { status: "In Progress", assignedTo: req.user._id },
      { new: true },
    )
      .populate("owner", "name email")
      .populate("assignedTo", "name email");

    if (!updated) {
      // Job was not found or already taken
      throw new AppError("Job is no longer available to accept", 409);
    }
    const jobObj = updated.toObject ? updated.toObject() : updated;
    const isOwner =
      req.user && jobObj.owner && req.user._id === jobObj.owner.toString();
    if (!isOwner && jobObj.status === "Open") delete jobObj.contactNumber;

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: jobObj,
    });
  }

  // Otherwise, regular update flow
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

  job.status = newStatus;
  await job.save();
  const updatedDoc = await JobRequest.findById(job._id)
    .populate("owner", "name email")
    .populate("assignedTo", "name email");
  const jobObj = updatedDoc.toObject ? updatedDoc.toObject() : updatedDoc;
  const isOwner =
    req.user && jobObj.owner && req.user._id === jobObj.owner.toString();
  if (!isOwner && jobObj.status === "Open") delete jobObj.contactNumber;

  res.status(200).json({
    success: true,
    message: "Job status updated successfully",
    data: jobObj,
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
