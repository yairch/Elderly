const express = require('express');
const bcrypt = require('bcrypt');
const DButils = require('../DButils.js');
const {bcrypt_saltRounds} = require('../DButils');
const {sendConfirmationEmail} = require('../emailSender');
const router = express.Router();

// register organization
router.post('/registerOrganization', async (req, res, next) => {
	try {
		const {organizationName, organizationEnglishName, phoneNumber} = req.body;
		const organizationType = req.body.organizationType.value;

		console.log('organization');
		console.log(req.body);
		// organizations exist
		let organizations = [];
		organizations = await DButils.execQuery('SELECT organizationName, organizationEnglishName FROM organizations');
		if (organizations.find((x) => x.organizationName === organizationName || x.organizationEnglishName === organizationEnglishName))
			throw {status: 409, message: 'Organization name taken'};

		//insert into DB Organization
		await DButils.execQuery('Insert into organizations (organizationName, organizationEnglishName, organizationType, phoneNumber) '
			+ `VALUES ('${organizationName}', '${organizationEnglishName}', '${organizationType}', '${phoneNumber}');`);

	} catch (error) {
		next(error);
	}
});

router.post('/registerResponsible', async (req, res, next) => {
	try {
		const {firstName, lastName, username, password, email} = req.body;
		const organizationName = req.body.organizationName.value;
		const responsibleType = req.body.responsibleType.value;
		const gender = req.body.gender.value;

		console.log("organizationName");
		console.log(organizationName);
		// username exists
		let users = [];
		users = await DButils.execQuery('SELECT username FROM users');
		if (users.find((x) => x.username === username))
			throw {status: 409, message: 'Username taken'};

		// make hash to password
		let hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await DButils.execQuery('Insert into users (userName, password, userRole, organizationName) '
			+ `VALUES ('${username}', '${hash_password}', 'responsible', '${organizationName}');`);

		// insert into DB responsibleUsers
		await DButils.execQuery('Insert into responsibleUsers (userName, firstName, lastName, email, gender,' +
			'organizationName, responsibleType) '
			+ `VALUES ('${username}', '${firstName}', '${lastName}', '${email}', '${gender}',
            '${organizationName}','${responsibleType}');`);

		await sendConfirmationEmail({username, email, password, firstName, lastName});
		//send result
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send({message: 'registration succeeded', success: true});
	} catch (error) {
		next(error);
	}
});

router.get('/organizationNames', async (req, res, next) => {
	try {
		let organizations = await DButils.execQuery(`SELECT organizationName,organizationEnglishName FROM organizations`);
		res.send(JSON.parse(JSON.stringify(organizations)));
	} catch (error) {
		next(error);
	}
});


router.get('/users', async (req, res, next) => {
	try {
		let users = await DButils.execQuery(`SELECT userName,userRole,organizationName FROM users`);
		res.send(JSON.parse(JSON.stringify(users)));
	} catch (error) {
		next(error);
	}
});

module.exports = router;