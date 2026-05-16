const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for the given user id.
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

/**
 * Creates and sends a signed JWT in the response.
 * Strips password from the user object before sending.
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = { signToken, sendTokenResponse };
