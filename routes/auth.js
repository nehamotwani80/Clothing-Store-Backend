const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//exported form controllers
const { signout, signup, login, isLoggedin } = require('../controllers/auth');

// routers for user
router.post(
	'/signup',
	[
		check('name').isLength({ min: 3 }).withMessage('Minimum 3 characters'),
		check('email', 'Email is empty or invalid').isEmail().normalizeEmail(),
		check('email', 'Enter email in lowerCase').isLowercase(),
		check('password', 'Password must contain minimum 5 characters').isLength({
			min: 5,
		}),
	],
	signup
);

router.post(
	'/login',
	[
		check('email', 'Email is empty or invalid').isEmail().normalizeEmail(),
		check('password', 'password is required').isLength({ min: 5 }),
	],
	login
);

router.get('/signout', signout);

// router.get('/test', isLoggedin, (req, res) => {
// 	res.send('protected page');
// });

// export all the routes to app.js
module.exports = router;
