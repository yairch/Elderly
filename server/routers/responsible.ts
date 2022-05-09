import { userFields } from './../constants/collections';
import bcrypt from 'bcrypt';
import express from 'express';
import * as Cookies from 'js-cookie';
import * as userDB from '../DButils/user';
import * as volunteerDB from '../DButils/volunteer';
import * as elderlyDB from '../DButils/elderly';
import * as meetingDB from '../DButils/meeting';
import * as adjustmentPercentageDB from '../DButils/adjustmentPercentage';
import { User, UserRole } from '../types/user';
import {sendConfirmationEmail, sendMeetingEmail} from '../emailSender';
import {bcrypt_saltRounds} from '../constants/bycrypt'
import { Volunteer } from '../types/volunteer';
import { Elderly } from '../types/elderly';
import { Match } from '../types/match';
import { GenderToMeet } from '../types/genderToMeet';

const router = express.Router();


// register volunteer
router.post('/registerVolunteer', async (req, res, next) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			birthYear,
			email,
			city,
			gender,
			areasOfInterest,
			languages,
			services,
			preferredDaysAndHours,
			digitalDevices,
			phoneNumber,
			organizationName,
			additionalInformation
		} = req.body as User & Volunteer;

		// username exists
		const user = await userDB.getUserByUsername(username);
		if (user) {
			res.status(401).send('Username or Password incorrect');
			return;
		}
		
		// make hash to password
		const hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await userDB.insertUser(username, hash_password, UserRole.Volunteer, organizationName);

		// insert into DB volunteerUsers
		await volunteerDB.insertVolunteer(username, firstName, lastName, birthYear, city, email, gender, areasOfInterest, languages, services, preferredDaysAndHours, digitalDevices, phoneNumber, organizationName, additionalInformation);

		await sendConfirmationEmail({username, email, password, firstName, lastName});
		
		//send result
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send({message: 'registration succeeded', success: true});
	}
	catch (error) {
		next(error);
	}
});

// register elderly
router.post('/registerElderly', async (req, res, next) => {
	try {
		const {
			username,
			password,
			firstName,
			lastName,
			birthYear,
			email,
			city,
			gender,
			phoneNumber,
			areasOfInterest,
			languages,
			organizationName,
			wantedServices,
			genderToMeetWith,
			preferredDaysAndHours,
			digitalDevices,
			additionalInformation,
			contactName,
			kinship,
			contactPhoneNumber,
			contactEmail
		} = req.body as User & Elderly

		// username exists
		const user = await userDB.getUserByUsername(username);
		if (user) {
			res.status(401).send('Username or Password incorrect');
			return;
		}

		// make hash to password
		const hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await userDB.insertUser(username, hash_password, UserRole.Elderly, organizationName);

		// insert into DB Elderly
		await elderlyDB.insertElderly( username, firstName, lastName, birthYear, city, email, gender,
			phoneNumber, areasOfInterest, languages, organizationName, wantedServices, genderToMeetWith, preferredDaysAndHours,
			digitalDevices, additionalInformation, contactName, kinship, contactPhoneNumber, contactEmail);

		await sendConfirmationEmail({username, email, password, firstName, lastName});

		//send result
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send({message: 'registration succeeded', success: true});
	}
	catch (error) {
		next(error);
	}
});

router.post('/assign', async (req, res, next) => {
	try {
		// req.body takes only username of volunteer type and is beign renamed (alias) as volunteerUsername
		const {username: volunteerUsername} = req.body as Pick<Volunteer, 'username'>;
		const volunteerDetails = await volunteerDB.getVolunteerDetails(volunteerUsername);
		const elderlyDetails = await elderlyDB.getElderlyUsers();
		const elderlyWithSameServicesAsVolunteer: Elderly[] = [];

		//take only the elderly with the same wanted service as the volunteer service
		if (elderlyDetails){
			for (let elderly of elderlyDetails) {
				const hasCommonServices = elderly.wantedServices.some(service => volunteerDetails?.services.includes(service))
				if (hasCommonServices) {
					elderlyWithSameServicesAsVolunteer.push(elderly);
				}
			}
		}

		console.log('elderlyWithSameServicesAsVolunteer');
		console.log(elderlyWithSameServicesAsVolunteer);

		const matches: Match[] = [];

		if (elderlyWithSameServicesAsVolunteer.length > 0) {
			for (let elderly of elderlyWithSameServicesAsVolunteer) {
				// let rankForServices = 0;
				let rankForPreferredDays = 0;
				let rankForLanguage = 0;
				let rankForGender = 0;
				let rankForInterest = 0;
				let finalRank = 0;
				
				//services
				const commonServices = elderly.wantedServices.filter(service => volunteerDetails?.services.includes(service));
				
				//preferred days and hours
				const commonPreferredDays = elderly.preferredDaysAndHours.filter(day => volunteerDetails?.preferredDaysAndHours.includes(day));
				if (commonPreferredDays.length > 0) {
					rankForPreferredDays = 1;
				}
				
				//languages
				const commonLanguages = elderly.languages.filter(lan => volunteerDetails?.languages.includes(lan));
				if (commonLanguages.length > 0) {
					rankForLanguage = 1;
				}
				
				//gender
				let preferredGender: GenderToMeet | undefined = undefined;
				if (volunteerDetails?.gender.valueOf() === elderly.genderToMeetWith.valueOf() || elderly.genderToMeetWith === GenderToMeet.IDC) {
					preferredGender = elderly.genderToMeetWith;
				}
				if (preferredGender) {
					rankForGender = 1;
				}

				//areaOfInterest
				const commonAreaOfInterest = elderly.areasOfInterest.filter(area => volunteerDetails?.areasOfInterest.includes(area));
				if (commonAreaOfInterest.length > 0) {
					rankForInterest = 1;
				}

				finalRank = 0.35 * rankForPreferredDays + 0.35 * rankForLanguage + 0.2 * rankForInterest + 0.1 * rankForGender;

				matches.push({
					elderly: elderly,
					volunteerUsername: volunteerUsername,
					preferredDay: elderly.preferredDaysAndHours,
					finalRank: finalRank.toFixed(2),
					commonAreaOfInterest: commonAreaOfInterest,
					commonLanguages: commonLanguages,
					commonPreferredDays: commonPreferredDays,
					commonServices: commonServices,
					preferredGender: elderly.genderToMeetWith
				});
			}

			matches.sort(function (a, b) {
				return parseFloat(b.finalRank) - parseFloat(a.finalRank);
			});
			res.send(matches);
		}

		res.send();
	}
	catch (error) {
		next(error);
	}
});

router.post('/addMeeting', async (req, res, next) => {
	try {
		// FIXME: better to understand what type is user and change types
		const user = req.body.user;
		const meetingDayAndHour = req.body.user.actualDate as Date;
		const volunteerUsername = req.body.user.volunteerUsername as string;
		const elderlyUsername = req.body.user.elderly.userName as string;
		const meetingSubject = req.body.user.meetingSubject as string;
		const channelName = volunteerUsername + elderlyUsername + meetingDayAndHour;
		console.log(meetingDayAndHour);
		console.log(volunteerUsername);
		console.log(elderlyUsername);
		console.log(channelName);
		console.log(meetingSubject);

		
		const volunteer = await volunteerDB.getVolunteerDetails(volunteerUsername);
		
		// FIXME: what to do if volunteer null?
		if (volunteer){
			
			// FIXME: fix types
			await sendMeetingEmail({
				email: volunteer.email,
				firstName: volunteer.firstName,
				lastName: volunteer.lastName,
				meeting: {
					date: user.actualDate,
					elderlyName: user.elderly.firstName + ' ' +user.elderly.lastName,
					subject: user.meetingSubject
				}
			});

			await meetingDB.insertMeeting(volunteerUsername, elderlyUsername, meetingDayAndHour, meetingSubject , channelName);
			res.status(200).send({message: 'added meeting', success: true});
		} else{
			throw Object.assign(
				new Error(),
				{message: 'volunteer does not exist'}
			)
		}
	}
	catch (error) {
		next(error);
	}
});

router.get('/meetings-volunteers/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		let volunteerMeetingsInOrganizations = await meetingDB.getMeetingsByOrganization(organizationName);
		console.log(volunteerMeetingsInOrganizations);
		res.send(JSON.parse(JSON.stringify(volunteerMeetingsInOrganizations)));
	}
	catch (error) {
		next(error);
	}
});

router.get('/meetings-elderly/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		organizationName = organizationName.substring(0, organizationName.length - 1);
		let elderlyMeetingsInOrganizations = await meetingDB.getMeetingsByOrganization(organizationName);
		console.log(elderlyMeetingsInOrganizations);
		res.send(JSON.parse(JSON.stringify(elderlyMeetingsInOrganizations)));

	}
	catch (error) {
		next(error);
	}
});

router.get('/volunteersDetails/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		let volunteers;
		if (organizationName !== 'NONE') {
			volunteers = await volunteerDB.getVolunteersByOrganization(organizationName);
		}
		else{
			res.status(204).send({message: 'organization not found', success: false});
			// volunteers = await volunteerDB.getAllVolunteers();
		}

		res.send(JSON.stringify(volunteers));
	}
	catch (error) {
		next(error);
	}
});

router.get('/elderlyDetails/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		let elderlys;

		if (organizationName !== 'NONE') {
			elderlys = await elderlyDB.getElderlyDetails(organizationName);
		}
		else {
			res.status(204).send({message: 'organization not found', success: false});
			// elderlys = await elderlyDB.getElderlyUsers();
		}

		// elderlys = elderlyDB.convertElderlyDetailsFromDB(elderlys);
		res.send(JSON.stringify(elderlys));
	}
	catch (error) {
		next(error);
	}
});

router.delete('/deleteMeeting/:channelName',async (req, res, next) => {
	try {
		console.log('deleteMeeting');
		let {channelName} = req.params;
		channelName = channelName.substring(0, channelName.length - 1);
		let check = await meetingDB.checkMeetingExistsByChannel(channelName);
		if(check){
			await meetingDB.deleteMeetingsByChannel(channelName);
			res.status(200).send({message: 'delete succeeded', success: true});
		}
	}
	catch (error) {
		next(error);
	}
});

router.put('/change-adjustment-percentages/:username', async (req, res, next) => {
	try {
		let {username} = req.params;
		console.log(username);
		const dateRank = req.body.dateRank as number;
		const languageRank = req.body.dateRank as number;
		const interestRank = req.body.interestRank as number;
		const genderRank = req.body.genderRank as number;
		// const username = Cookies.get(userFields.username);
		const organizationName = await userDB.getOrganizationNameByUsername(username);
		if(organizationName){
			let ap = await adjustmentPercentageDB.changePercent(organizationName.organizationName, dateRank, languageRank, interestRank, genderRank);
			res.send(ap);
		}
	}	
	catch (error) {
		next(error);
	}
});

export default router;


