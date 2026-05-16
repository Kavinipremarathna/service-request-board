const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendTokenResponse } = require("../utils/jwt");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({ name, email, password, role });
  sendTokenResponse(user, 201, res);
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // Explicitly select password (it's excluded by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// @desc    Update profile (name, email)
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("User not found", 404);

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) throw new AppError("Email already in use", 409);
  }

  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    Change password
// @route   PUT /api/auth/me/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Please provide current and new passwords", 400);
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw new AppError("User not found", 404);

  if (!(await user.matchPassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated" });
});

module.exports = { register, login, getMe };
