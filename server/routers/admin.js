const express = require('express');
const bcrypt = require('bcrypt');
const DButils = require('../DButils.js');
const {bcrypt_saltRounds} = require('../DButils');
const {sendConfirmationEmail} = require('../emailSender');
const router = express.Router();

// register organization
router.post('/registerOrganization', async (req, res, next) => {
	try {
		const {name, englishName, phoneNumber} = req.body;
		const type = req.body.organizationType.value;

		console.log('organization');
		console.log(req.body);

		// organization exist
		const organizationByName = await DButils.getOrganizationByName(name);
		const organizationByEnglishName = await DButils.getOrganizationByEnglishName(englishName);
		if ( organizationByName || organizationByEnglishName){
			res.status(409).send('Organization name taken');
			return;
		}

		//insert into DB Organization
		await DButils.insertOrganization(name, englishName, type, phoneNumber);

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
		const user = await DButils.getUserByUsername(username);
		if (user){
			res.status(409).send('Username taken');
			return;
		}

		// make hash to password
		const hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await DButils.insertUser(username, hash_password, 'responsible', organizationName);

		// insert into DB responsibleUsers
		await DButils.insertResponsible(username, firstName, lastName, email, gender, organizationName, responsibleType);

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
		const organizations = (await DButils.getAllOrganizations())
			.map(org => ({
				name: org.name,
				englishName: org.englishName,
			}))
		res.send(organizations);
	} catch (error) {
		next(error);
	}
});


router.get('/users', async (req, res, next) => {
	try {
		const users = await DButils.getUsers()
		res.send(users);
	} catch (error) {
		next(error);
	}
});

module.exports = router;