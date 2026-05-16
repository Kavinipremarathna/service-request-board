const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateAuth");
const { protect } = require("../middleware/auth");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);

module.exports = router;
