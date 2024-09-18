const express = require('express');

const { register, login, getMe, logout } = require('../controllers/auth');

const router = express.Router();

const { protected } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', protected, getMe);
router.get('/logout', logout)

module.exports = router;