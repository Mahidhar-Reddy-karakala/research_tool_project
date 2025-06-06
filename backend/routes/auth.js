// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();



// // Utility: Generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // Utility: Set HTTP-only cookie
// const setAuthCookie = (res, token) => {
//   res.cookie('authToken', token, {
//     httpOnly: true,
//     secure: true, // change to true in production with HTTPS
//     sameSite: 'None',
//     maxAge: 60 * 60 * 1000, // 1 hour
//   });
// };

// // @route   POST /api/auth/register
// // @desc    Register a new user
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     const newUser = new User({ username, email, password });
//     await newUser.save();

//     const token = generateToken(newUser._id);
//     setAuthCookie(res, token);

//     res.status(201).json({ user: { id: newUser._id, username, email } });
//   } catch (error) {
//     console.error('Registration Error:', error.message);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user and set token cookie
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = generateToken(user._id);
//     setAuthCookie(res, token);

//     res.status(200).json({ user: { id: user._id, username: user.username, email } });
//   } catch (error) {
//     console.error('Login Error:', error.message);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // @route   GET /api/auth/verify
// // @desc    Verify user token from cookie
// router.get('/verify', (req, res) => {
//   const token = req.cookies.authToken;

//   if (!token) return res.status(401).json({ valid: false });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({ valid: true, userId: decoded.id });
//   } catch (err) {
//     return res.status(401).json({ valid: false });
//   }
// });

// // @route   POST /api/auth/logout
// // @desc    Clear auth cookie
// router.post('/logout', (req, res) => {
//   res.clearCookie('authToken', {
//     httpOnly: true,
//     secure: false, // true in production
//     sameSite: 'none',
//   });
//   res.status(200).json({ message: 'Logged out successfully' });
// });

// module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Utility: Generate JWT token
const generateToken = (userId) => {
  // Use 'sub' as the standard JWT subject claim
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// Utility: Set HTTP-only cookie
const setAuthCookie = (res, token) => {
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);
    setAuthCookie(res, token);

    res.status(201).json({
      user: { id: newUser._id, username, email },
      token, // Optional: return token for SPA/mobile
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and set token cookie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      user: { id: user._id, username: user.username, email },
      token, // Optional: return token for SPA/mobile
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify user token from cookie
router.get('/verify', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, userId: decoded.sub });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
});

// @route   POST /api/auth/logout
// @desc    Clear auth cookie
router.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/user',async (req,res)=>{
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user =await User.findById(decoded.sub)
      .then(user => {
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email,avatar:"/avatars/shadcn.jpg" } });
      })
      .catch(err => res.status(500).json({ message: 'Server error', error: err.message }));
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
})




module.exports = router;
