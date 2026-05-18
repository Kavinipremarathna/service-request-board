const { body, validationResult } = require("express-validator");

// Collect validation errors and return 422 if any exist
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateCreateJob = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("category")
    .optional()
    .isIn([
      "Plumbing",
      "Electrical",
      "Painting",
      "Joinery",
      "Roofing",
      "Flooring",
      "Gardening",
      "Cleaning",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("contactEmail")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("contactNumber")
    .optional({ checkFalsy: true })
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Please provide a valid phone number"),

  handleValidationErrors,
];

const validateUpdateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Open", "In Progress", "Closed"])
    .withMessage("Status must be Open, In Progress, or Closed"),

  handleValidationErrors,
];

module.exports = { validateCreateJob, validateUpdateStatus };
