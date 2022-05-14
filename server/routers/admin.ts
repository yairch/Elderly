import bcrypt from 'bcrypt';
import express from 'express';
import * as organizationDB from '../DButils/organization';
import * as responsibleDB from '../DButils/responsible';
import * as userDB from '../DButils/user';
import * as adjustmentPercentageDB from '../DButils/adjustmentPercentage';
import { Organization } from '../types/organization';
import { User, UserRole } from '../types/user';
import {sendConfirmationEmail} from '../emailSender';
import {bcrypt_saltRounds} from '../constants/bycrypt'
import { Responsible } from '../types/responsible';
const router = express.Router();

// register organization
router.post('/registerOrganization', async (req, res, next) => {
	try {
		const name = req.body.organizationName
		const englishName = req.body.organizationEnglishName
		const phoneNumber = req.body.phoneNumber
		const type = req.body.organizationType.value;

		console.log('organization');
		console.log(req.body);

		// organization exist
		const organizationByName = await organizationDB.getOrganizationByName(name);
		const organizationByEnglishName = await organizationDB.getOrganizationByEnglishName(englishName);
		if ( organizationByName || organizationByEnglishName){
			res.status(409).send('Organization name taken');
			return;
		}
		//insert into DB Organization
		await organizationDB.insertOrganization(name, englishName, type, phoneNumber);
		//set default values for adjustment percentages
		await adjustmentPercentageDB.setDefaultPercent(name, 25, 25, 25, 25);
		res.status(200).send({message: 'registration succeeded', success: true});
	} 
	catch (error) {
		next(error);
	}
});

router.post('/registerResponsible', async (req, res, next) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			email,
			gender,
			organizationName,
			responsibleType
		} = req.body as User & Responsible

		console.log("organizationName");
		console.log(organizationName);
		
		// username exists
		const user = await userDB.getUserByUsername(username);
		if (user){
			res.status(409).send('Username taken');
			return;
		}

		// make hash to password
		const hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await userDB.insertUser(username, hash_password, UserRole.Responsible, organizationName);

		// insert into DB responsibleUsers
		await responsibleDB.insertResponsible(username, firstName, lastName, email, gender, organizationName, responsibleType);

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
		const organizations = (await organizationDB.getAllOrganizations())
			.map((org: Organization) => ({
				name: org.name,
				englishName: org.englishName
			}))
		res.send(organizations);
	} catch (error) {
		next(error);
	}
});


router.get('/users', async (req, res, next) => {
	try {
		const users = await userDB.getAllUsers()
		res.send(users);
	} catch (error) {
		next(error);
	}
});

export default router;