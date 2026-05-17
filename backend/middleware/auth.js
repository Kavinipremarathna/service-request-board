const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * protect — Verifies the JWT and attaches req.user.
 * Expects: Authorization: Bearer <token>
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authenticated. Please log in to continue.", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError(
      "The account linked to this token no longer exists.",
      401,
    );
  }

  req.user = user;
  next();
});

/**
 * authorize(...roles) — Must be used after protect.
 * Throws 403 if the authenticated user's role is not in the allowed list.
 *
 * Usage:
 *   router.post('/', protect, authorize('homeowner'), createJob);
 *   router.patch('/:id', protect, authorize('worker', 'homeowner'), updateStatus);
 */
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.activeRole)) {
      const canSwitch = req.user.roles.some((r) => roles.includes(r));
      throw new AppError(
        `Access denied. This requires the "${roles.join(" or ")}" role.${canSwitch ? ` Switch roles to continue.` : ""}`,
        403,
      );
    }
    next();
  };

module.exports = { protect, authorize };
