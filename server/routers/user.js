const express = require('express');
const bcrypt = require('bcrypt');
const DButils = require('../DButils.js');
const {bcrypt_saltRounds} = require('../DButils');
// const {initWebSocketServer} = require('../notifications');
// const server = require('../server');
const {sendForgotPasswordEmail} = require('../emailSender');
const {userFields} = require('../constants/collections')

const router = express.Router();

router.post('/login', async (req, res, next) => {
	try {
		const {username, password} = req.body;
		// check that username exists
		const user = await DButils.getUserByUsername(username);

		if (!user || !bcrypt.compareSync(password, user[userFields.password])) {
			res.status(401).send('Username or Password incorrect');
			return;
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

		const user = await DButils.getUserByUsername(username);
		console.log(user);
		// check that username exists
		// check that the password is correct
		if (!user || !bcrypt.compareSync(password, user[userFields.password])) {
			res.status(401).send('Username or Password incorrect');
			return;
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
		const user = await DButils.getUserByUsername(username);
		if (!user) {
			res.status(401).send('UserName incorrect');
			return;
		}

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
		const {username, newPassword} = req.body;
		console.log(username);
		console.log(newPassword);
		const hashPassword = bcrypt.hashSync(newPassword, parseInt(bcrypt_saltRounds));
		await DButils.updateUserPassword(username, hashPassword);
		res.status(200).send({message: 'update password succeeded', success: true});
	}
	catch (error) {
		// next(error);
		console.log(error);
		res.status(401).send({message: error.message, success: false});
	}
});

module.exports = router;
