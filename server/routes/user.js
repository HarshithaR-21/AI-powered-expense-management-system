const express = require('express');
const { handleSignUp, handleLogin, handleLogout, handleGetUser } = require('../controllers/user');
const router = express.Router();
const cookieParser = require('cookie-parser');
const auth = require('../middleware/auth');
router.use(cookieParser());

router.post('/signup', handleSignUp);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.get('/getuser',auth, handleGetUser);

module.exports = router;