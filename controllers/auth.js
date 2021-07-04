const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');
const user = require('../models/user');

//setting custom error messages
const handlingErrors = (error) => {
	let errors = {
		name: '',
		email: '',
		password: '',
	};

	error.array().forEach((err) => {
		errors[err.param] = err.msg;
	});
	// res.status(422).json({ errors });
	return errors;
};

//signup
exports.signup = (req, res) => {
	let error = validationResult(req);
	if (!error.isEmpty()) {
		const errors = handlingErrors(error);
		return res.status(422).json({ errors });
	} else {
		var user = new User(req.body);
		user.save((err, user) => {
			if (err) {
				return res.status(422).json({ errors: { email: 'Email already exists' } });
			} else {
				res.status(201).json({
					name: user.name,
					lastname: user.lastname,
					email: user.email,
					id: user._id,
					message: 'The user is successfully saved!',
				});
			}
		});
	}
};

//login
exports.login = (req, res) => {
	const { email, password } = req.body;
	//validating user input
	var error = validationResult(req);
	if (!error.isEmpty()) {
		const errors = handlingErrors(error);

		return res.status(422).json({ errors });
	} else {
		User.findOne({ email: email }, (err, user) => {
			if (!user) {
				return res
					.status(400)
					.json({ errors: { email: 'Email ID does not found.' } });
			} else if (!user.authenticate(password)) {
				return res
					.status(401)
					.json({ errors: { password: 'Incorrect PASSWORD.' } });
			} else if (err) {
				res.status(400).json(err);
				return;
			} else {
				// create token
				const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
					expiresIn: 60 * 60 * 24,
				});

				//put token in cookie (maxAge takes value in m-sec)
				res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

				//sending response
				const { _id, name, email, role } = user;
				res.json({ token, user: { _id, name, email, role } });
			}
		});
	}
};

//signout
exports.signout = (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'User signout successfully!' });
};

//protected routes
//NOTE: app.use(expressjwt({ secret: ''}).unless({path: ['/auth/login']}));

//custom middlewares
exports.isLoggedin = expressJwt({
	secret: process.env.SECRET,
	userProperty: 'auth',
	// we are extracting _id property from token in cookie using
	//expressJwt
});

exports.isAuthenticated = (req, res, next) => {
	if (!(req.auth && req.profile && req.auth._id == req.profile._id)) {
		res.status(403).json({
			error: 'ACCESS DENIED',
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		res.status(403).json({
			error: 'NOT ADMIN, access denied',
		});
	}
	next();
};
