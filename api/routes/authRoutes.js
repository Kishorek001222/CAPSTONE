const express = require('express');
const {
  signup,
  login,
  getMe,
  updateWallet,
  updateDID
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/wallet', protect, updateWallet);
router.put('/did', protect, updateDID);

module.exports = router;
