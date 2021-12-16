const express = require('express');
const bcrypt = require('bcrypt');
const DButils = require('../DButils.js');
const {bcrypt_saltRounds} = require('../DButils');
const {initWebSocketServer} = require('../notifications');
const server = require('../server');
const {sendForgotPasswordEmail} = require('../emailSender');

const router = express.Router();

router.post('/login', async (req, res, next) => {
	try {
		let {username, password} = req.body;
		// check that username exists
		let users = await DButils.execQuery('SELECT userName FROM users');
		console.log(users);
		if (!users.find((x) => x.userName === username))
			throw {status: 401, message: 'Username incorrect'};

		// check that the password is correct
		const user = (
			await DButils.execQuery(
				`SELECT userName, password, userRole, elderly.users.organizationName, organizationType
				 FROM elderly.users JOIN elderly.organizations ON elderly.users.organizationName = elderly.organizations.organizationName
				 WHERE username = '${username}'`
			)
		)[0];

		if (!bcrypt.compareSync(password, user.password)) {
			throw {status: 401, message: 'Username or Password incorrect'};
		}

		res.status(200).send({user: user, message: 'login succeeded', success: true});
	}
	catch (error) {
		// next(error);
		console.log(error);
		res.status(401).send({message: error.message, success: false});
	}
});

router.post('/activate/:username&:password', async (req, res, next) => {
	try {
		//the password is hashed
		let {username, password} = req.params;
		username = username.substring(9, username.length);
		password = password.substring(9, password.length);

		console.log('username ' + username);
		console.log('password ' + password);

		// check that username exists
		let users = await DButils.execQuery('SELECT userName FROM users');
		console.log(users);
		if (!users.find((x) => x.userName === username))
			throw {status: 401, message: 'UserName incorrect'};

		// check that the password is correct
		const user = (
			await DButils.execQuery(
				`SELECT * FROM users WHERE username = '${username}'`
			)
		)[0];

		if (!bcrypt.compareSync(password, user.password)) {
			throw {status: 401, message: 'Username or Password incorrect'};
		}

		res.status(200).send({user: user, message: 'login succeeded', success: true});
	}
	catch (error) {
		// next(error);
		console.log(error);
		res.status(401).send({message: error.message, success: false});
	}
});

router.post('/forgot-password/:username&:email', async (req, res, next) => {
	try {
		let {username, email} = req.params;
		username = username.substring(9, username.length);
		email = email.substring(9, email.length);

		// check that username exists
		let users = await DButils.execQuery('SELECT userName FROM users');
		if (!users.find((x) => x.userName === username))
			throw {status: 401, message: 'UserName incorrect'};

		await sendForgotPasswordEmail(username, email);
		res.status(200).send({message: 'user exists', success: true});
	}
	catch (error) {
		// next(error);
		console.log(error);
		res.status(401).send({message: error.message, success: false});
	}
});

router.put('/updatePassword', async (req, res, next) => {
	try {
		console.log('updatePassword');
		let {username, newPassword} = req.body;
		console.log(username);
		console.log(newPassword);
		let hashPassword = bcrypt.hashSync(newPassword, parseInt(bcrypt_saltRounds));
		await DButils.execQuery(`UPDATE users SET password='${hashPassword}' where userName='${username}'`);
		res.status(200).send({message: 'update password succeeded', success: true});
	}
	catch (error) {
		// next(error);
		console.log(error);
		res.status(401).send({message: error.message, success: false});
	}
});

module.exports = router;
