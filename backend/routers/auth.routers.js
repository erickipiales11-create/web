const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', auth, authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.me);
router.get('/validate', auth, authController.validateToken);

module.exports = router;