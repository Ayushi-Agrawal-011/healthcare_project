const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const s = require('../validators/schemas');
const { HttpError, asyncHandler } = require('../utils/http');

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = s.register.parse(req.body);

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new HttpError(409, 'Email is already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = s.login.parse(req.body);

  const user = await User.findOne({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) throw new HttpError(401, 'Invalid email or password');

  res.json({
    message: 'Login successful',
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email },
  });
});
