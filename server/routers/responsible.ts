import bcrypt from 'bcrypt';
import express from 'express';
import * as userDB from '../DButils/user';
import * as volunteerDB from '../DButils/volunteer';
import * as elderlyDB from '../DButils/elderly';
import * as meetingDB from '../DButils/meeting';
import * as responsibleDB from '../DButils/responsible';
import * as adjustmentPercentageDB from '../DButils/adjustmentPercentage';
import { User, UserRole } from '../types/user';
import {sendConfirmationEmail, sendMeetingEmail} from '../emailSender';
import {bcrypt_saltRounds} from '../constants/bycrypt'
import { Volunteer } from '../types/volunteer';
import { Elderly } from '../types/elderly';
import { Match } from '../types/match';
import { GenderToMeet } from '../types/genderToMeet';
import { match } from 'assert';

const router = express.Router();

// get responsible
router.get('/:username', async (req, res, next) => {
	try {
		const {username} = req.params;
		
		// username exists
		const responsible = await responsibleDB.getResponsibleByUsername(username);
		if (!responsible) {
			res.status(404).send('responsible doesn\'t exist');
			return;
		}
		
		res.status(200).send(JSON.stringify(responsible));
	}
	catch (error) {
		next(error);
	}
});

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
		const volunteerDetails = req.body.user as Volunteer;
		const elderlyDetails = await elderlyDB.getElderlyUsers();
		let elderlyWithSameServicesAsVolunteer: Elderly[] = [];
		let wantedServices, wantedDates;
		//services
		let serviceElderly, serviceVolunteer, offerServices, serElderly, serVolunteer;
		//dates
		let offerPreferredDates, dateVolunteer, datesVolunteer, datesElderly, dateElderly;
		

		//take only the elderly with the same wanted service as the volunteer service
		if (elderlyDetails){
			
			//------------------------- get volunteer details ---------------------------
			//get volunteer services
			let volunteerServiceArr = []
			offerServices = Object.values(volunteerDetails.services)
			for (let offerService in offerServices){
				serviceVolunteer = offerServices[offerService];
				serVolunteer = Object.values(serviceVolunteer)[0];
				volunteerServiceArr.push(serVolunteer) 
			}

			//get volunteer preferred dates
			let volunteerPreferredDatesArr = []
			offerPreferredDates = Object.values(volunteerDetails.preferredDaysAndHours)
			for (let offerDates in offerPreferredDates){
				datesVolunteer = offerPreferredDates[offerDates];
				dateVolunteer = Object.values(datesVolunteer)[0];
				volunteerPreferredDatesArr.push(dateVolunteer) 
			}

			let matches: Match[] = [];
			for (let elderly of elderlyDetails) {
				let commonServices = [], commonDates = [];
				let rankForPreferredDays = 0;
				let rankForLanguage = 0;
				let rankForGender = 0;
				let rankForInterest = 0;
				let finalRank = 0;
				
				//------------------------------ service ---------------------------------
				let elderlyServicesArr = []
				wantedServices = Object.values(elderly.wantedServices)
				
				for (let wantedService in wantedServices){
					serviceElderly = wantedServices[wantedService];
					serElderly = Object.values(serviceElderly)[0];
					elderlyServicesArr.push(serElderly)
					if (volunteerServiceArr.includes(serElderly)){
						commonServices.push(serElderly)
					}
				}
				if(commonServices){
					elderlyWithSameServicesAsVolunteer.push(elderly)
				}

				//------------------------------ dates ---------------------------------
				let elderlyDatesArr = []
				wantedDates = Object.values(elderly.preferredDaysAndHours)
				
				for (let wantedDate in wantedDates){
					datesElderly = wantedDates[wantedDate];
					dateElderly = Object.values(datesElderly)[0];
					elderlyDatesArr.push(dateElderly)
					if (volunteerPreferredDatesArr.includes(dateElderly)){
						commonDates.push(dateElderly)
					}
				}
				if(commonDates){
					rankForPreferredDays = commonDates.length
				}

				//------------------------------ languages ---------------------------------
				//NULL
				rankForLanguage = 0

				//------------------------------ gender ---------------------------------
				let preferredGender
				let genderToMeet = Object.values(elderly.genderToMeetWith)[0]
				if (volunteerDetails.gender.valueOf() === genderToMeet.valueOf() || genderToMeet.valueOf() === 'אין העדפה'){
					preferredGender = genderToMeet;
				}
				
				if(preferredGender){
					rankForGender = 25
				}

				//------------------------------ areas of interest ---------------------------------
				//NULL
				rankForInterest = 0

				//final rank
				let organizationName = Object.values(elderly.organizationName)[1];
				let percentages = await adjustmentPercentageDB.getPercent(organizationName);
				console.log(percentages);
				console.log('rankForPreferredDays', rankForPreferredDays, 'rankForLanguage', rankForLanguage, 'rankForInterest', rankForInterest, 'rankForGender', rankForGender )
				if (percentages){
					finalRank = percentages.dateRank * rankForPreferredDays + percentages.languageRank * rankForLanguage + percentages.interestRank * rankForInterest + percentages.genderRank * rankForGender;
					console.log(finalRank)
				} 


				let commonAreaOfInterest = ['gg','ge']
				let commonLanguages = ['gg','ge']

				matches.push({
					elderly: elderly,
					volunteerUsername: volunteerDetails.username,
					finalRank: finalRank.toFixed(2),
					commonAreaOfInterest: commonAreaOfInterest,
					commonLanguages: commonLanguages,
					commonPreferredDays: commonDates,
					commonServices: commonServices,
					preferredGender: preferredGender
				});
			}
			res.send(matches)
		}
		
	}
	catch (error) {
		next(error);
	}
});

router.post('/addMeeting', async (req, res, next) => {
	try {
		// FIXME: better to understand what type is user and change types
		const user = req.body.user;
		const meetingDate = user.actualDate as Date;
		const volunteerUsername = user.volunteerUsername as string;
		const elderlyUsername = user.elderly.username as string;
		const meetingSubject = user.meetingSubject as string;
		const channelName = volunteerUsername + elderlyUsername + meetingDate;

		const volunteer = await volunteerDB.getVolunteerDetails(volunteerUsername);
		console.log(volunteer)
		// FIXME: what to do if volunteer null?
		if (volunteer){
			
			// FIXME: fix types
			// await sendMeetingEmail({
			// 	email: volunteer.email,
			// 	firstName: volunteer.firstName,
			// 	lastName: volunteer.lastName,
			// 	meeting: {
			// 		date: user.actualDate,
			// 		elderlyName: user.elderly.firstName + ' ' +user.elderly.lastName,
			// 		subject: user.meetingSubject
			// 	}
			// });

			await meetingDB.insertMeeting(volunteerUsername, elderlyUsername, meetingDate, meetingSubject , channelName);
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
		const volunteers = await volunteerDB.getVolunteersByOrganization(organizationName);
		let volunteerMeetingsInOrganizations = []
		for(let volunteer in volunteers){
			let usernameVol = volunteers[parseInt(volunteer)].username;
			let meetings = await meetingDB.getFullVolunteerMeetings(usernameVol)
			for(let meeting in meetings){
				volunteerMeetingsInOrganizations.push(meetings[meeting]);
			}
		} 
		
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
		let meeting = await meetingDB.checkMeetingExistsByChannel(channelName);
		if(meeting){
			await meetingDB.deleteMeetingsByChannel(channelName);
			res.status(200).send({message: 'delete succeeded', success: true});
		}
	}
	catch (error) {
		next(error);
	}
});

router.get('/change-adjustment-percentages/:username', async (req, res, next) => {
	try {
		let {username} = req.params;
		console.log(username);
		const organizationName = await userDB.getOrganizationNameByUsername(username);
		if(organizationName){
			//get current organization's percentages
			let percentages = await adjustmentPercentageDB.getPercent(organizationName.organizationName);
			console.log(percentages);
			res.send(percentages);
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
		const languageRank = req.body.languageRank as number;
		const interestRank = req.body.interestRank as number;
		const genderRank = req.body.genderRank as number;
		const organizationName = await userDB.getOrganizationNameByUsername(username);
		if(organizationName){
			//update new organization's percentages
			await adjustmentPercentageDB.changePercent(organizationName.organizationName, dateRank, languageRank, interestRank, genderRank);
		}
		res.status(200).send({message: 'update succeeded', success: true});
	}	
	catch (error) {
		next(error);
	}
});

export default router;


