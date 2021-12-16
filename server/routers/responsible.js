const express = require('express');
const bcrypt = require('bcrypt');
const DButils = require('../DButils.js');
const {bcrypt_saltRounds} = require('../DButils');
const {sendConfirmationEmail, sendMeetingEmail} = require('../emailSender');
const router = express.Router();

// register volunteer
router.post('/registerVolunteer', async (req, res, next) => {
	try {
		const {firstName, lastName, birthYear, username, password, email, phoneNumber, additionalInformation} = req.body;
		const organizationName = req.body.organizationName.value;
		const city = req.body.city.value;
		const gender = req.body.gender.value;
		const areasOfInterest = req.body.selectedAreasOfInterest.map((dict) => dict.value);
		const languages = req.body.selectedLanguages.map((dict) => dict.value);
		const services = req.body.services.map((dict) => dict.value);
		const preferredDaysAndHours = req.body.preferredDaysAndHours.map((dict) => dict.value);
		const digitalDevices = req.body.digitalDevices.map((dict) => dict.value);

		// username exists
		let users = [];
		users = await DButils.execQuery('SELECT username FROM users');
		if (users.find((x) => x.username === username))
			throw {status: 409, message: 'Username taken'};

		// make hash to password
		let hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await DButils.execQuery('Insert into users (username, password, userRole, organizationName) '
			+ `VALUES ('${username}', '${hash_password}', 'volunteer', '${organizationName}');`);

		// insert into DB volunteerUsers
		await DButils.execQuery('Insert into volunteerUsers (userName, firstName, lastName, birthYear, city, email, gender, ' +
			'phoneNumber, areasOfInterest, languages, organizationName, services, preferredDays, digitalDevices, additionalInformation) '
			+ `VALUES ('${username}', '${firstName}', '${lastName}', '${birthYear}', '${city}', '${email}', '${gender}', '${phoneNumber}',
             '${JSON.stringify(areasOfInterest)}', '${JSON.stringify(languages)}', '${organizationName}', '${JSON.stringify(services)}', '${JSON.stringify(preferredDaysAndHours)}',
             '${JSON.stringify(digitalDevices)}', '${additionalInformation}');`);

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
		const {firstName, lastName, birthYear, username, password, email, phoneNumber, additionalInformation,
			contactName, kinship, contactPhoneNumber, contactEmail} = req.body;
		const organizationName = req.body.organizationName.value;
		const city = req.body.city.value;
		const gender = req.body.gender.value;
		const areasOfInterest = req.body.selectedAreasOfInterest.map((dict) => dict.value);
		const languages = req.body.selectedLanguages.map((dict) => dict.value);
		const wantedServices = req.body.wantedServices.map((dict) => dict.value);
		const preferredDaysAndHours = req.body.preferredDaysAndHours.map((dict) => dict.value);
		const digitalDevices = req.body.digitalDevices.map((dict) => dict.value);
		const genderToMeetWith = req.body.genderToMeetWith.value;

		// username exists
		let users = [];
		users = await DButils.execQuery('SELECT username FROM users');
		console.log(users);
		if (users.find((x) => x.username === username))
			throw {status: 409, message: 'Username taken'};

		// make hash to password
		let hash_password = bcrypt.hashSync(password, parseInt(bcrypt_saltRounds));

		//insert into DB users
		await DButils.execQuery('Insert into users (username, password, userRole, organizationName) '
			+ `VALUES ('${username}', '${hash_password}', 'elderly', '${organizationName}');`);

		// insert into DB Elderly
		await DButils.execQuery('Insert into elderlyUsers (userName, firstName, lastName, birthYear, city, email, gender, ' +
			'phoneNumber, areasOfInterest, languages, organizationName, wantedServices, genderToMeetWith, preferredDays, ' +
			'digitalDevices, additionalInformation, contactName, kinship, contactPhoneNumber, contactEmail) '
			+ `VALUES ('${username}', '${firstName}', '${lastName}', '${birthYear}', '${city}', '${email}', '${gender}', '${phoneNumber}',
             '${JSON.stringify(areasOfInterest)}', '${JSON.stringify(languages)}', '${organizationName}',
              '${JSON.stringify(wantedServices)}','${genderToMeetWith}', '${JSON.stringify(preferredDaysAndHours)}',
              '${JSON.stringify(digitalDevices)}', '${additionalInformation}', '${contactName}', '${kinship}',
               '${contactPhoneNumber}', '${contactEmail}');`);

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
		const {volunteerUsername, volunteerServices} = req.body;
		let volunteerDetails = await DButils.execQuery(`SELECT * FROM volunteerUsers where userName= '${volunteerUsername}'`);
		volunteerDetails = DButils.convertVolunteerDetailsFromDB(volunteerDetails)[0];

		let elderlyDetails = await DButils.execQuery(`SELECT * FROM elderlyUsers`);
		elderlyDetails = DButils.convertElderlyDetailsFromDB(elderlyDetails);
		let elderlyWithSameServicesAsVolunteer = [];

		//take only the elderly with the same wanted service as the volunteer service
		for (let elderly of elderlyDetails) {
			const foundSameServices = elderly.wantedServices.some(r => volunteerServices.includes(r));
			if (foundSameServices) {
				elderlyWithSameServicesAsVolunteer.push(elderly);
			}
		}

		console.log('elderlyWithSameServicesAsVolunteer');
		console.log(elderlyWithSameServicesAsVolunteer);

		let rankForEachElderly = [];

		if (elderlyWithSameServicesAsVolunteer.length > 0) {
			for (let elderly of elderlyWithSameServicesAsVolunteer) {
				let finalRank = 0;
				let rankForLanguage = 0;
				let rankForGender = 0;
				let rankForInterest = 0;
				let rankForPreferredDays = 0;
				const commonServices = elderly.wantedServices.map(service => {
					if (volunteerServices.includes(service)) {
						return service;
					}
				});
				//handle preferred days
				const commonPreferredDays = elderly.preferredDays.filter(day => volunteerDetails.preferredDays.includes(day));
				if (commonPreferredDays.length > 0) {
					rankForPreferredDays = 1;
				}
				//handle languages
				const commonLanguages = elderly.languages.filter(lan => volunteerDetails.languages.includes(lan));
				// const foundSameLanguage = elderlyWithDay.elderly.languages.some(r => volunteerDetails.languages.includes(r));
				if (commonLanguages.length > 0) {
					rankForLanguage = 1;
				}
				//handle gender
				let preferredGender = null;
				if (volunteerDetails.gender.includes(elderly.genderToMeetWith) || elderly.genderToMeetWith === 'אין העדפה') {
					preferredGender = elderly.genderToMeetWith;
				}
				if (preferredGender) {
					rankForGender = 1;
				}
				//handle areaOfInterest
				const commonAreaOfInterest = elderly.areasOfInterest.filter(area => volunteerDetails.areasOfInterest.includes(area));
				if (commonAreaOfInterest.length > 0) {
					rankForInterest = 1;
				}

				finalRank = 0.35 * rankForPreferredDays + 0.35 * rankForLanguage + 0.2 * rankForInterest + 0.1 * rankForGender;
				rankForEachElderly.push({
					elderly: elderly,
					volunteerUsername: volunteerUsername,
					preferredDay: elderly.preferredDays,
					finalRank: finalRank.toFixed(2),
					commonAreaOfInterest: commonAreaOfInterest,
					commonLanguages: commonLanguages,
					commonPreferredDays: commonPreferredDays,
					commonServices: commonServices,
					preferredGender: elderly.genderToMeetWith
				});
			}

			rankForEachElderly.sort(function (a, b) {
				return b.finalRank - a.finalRank;
			});

			res.send(rankForEachElderly);
		}

		res.send();
	}
	catch (error) {
		next(error);
	}
});

router.post('/addMeeting', async (req, res, next) => {
	try {
		const user = req.body.user;
		const meetingDayAndHour = req.body.user.actualDate;
		const volunteerUsername = req.body.user.volunteerUsername;
		const elderlyUsername = req.body.user.elderly.userName;
		const meetingSubject = req.body.user.meetingSubject;
		const channelName = volunteerUsername + elderlyUsername + meetingDayAndHour;
		console.log(meetingDayAndHour);
		console.log(volunteerUsername);
		console.log(elderlyUsername);
		console.log(channelName);
		console.log(meetingSubject);

		await DButils.execQuery('Insert into meetings (volunteeruserName, elderlyuserName, meeting, meetingSubject, channelName) '
			+ `VALUES ('${volunteerUsername}', '${elderlyUsername}', '${meetingDayAndHour}', '${meetingSubject}' ,'${channelName}');`);

		let volunteer = await DButils.execQuery(`Select firstName, lastName, email FROM volunteerUsers WHERE userName='${volunteerUsername}';`);
		volunteer = JSON.parse(JSON.stringify(volunteer))[0];

		await sendMeetingEmail({
			email: volunteer.email,
			firstName: volunteer.firstName,
			lastName: volunteer.lastName,
			meeting: {
				meetingDate: user.actualDate,
				elderlyName: user.elderly.firstName +' '+user.elderly.lastName,
				meetingSubject: user.meetingSubject
			}
		});

		res.status(200).send({message: 'added meeting', success: true});
	}
	catch (error) {
		next(error);
	}
});

router.get('/meetings-volunteers/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		organizationName = organizationName.substring(0, organizationName.length - 1);
		let volunteerMeetingsInOrganizations = await DButils.execQuery(`SELECT volunteerusers.firstName as volunteerFirstName,
		 volunteerusers.lastName as volunteerLastName, elderlyusers.firstName as elderlyFirstName,elderlyusers.lastName as elderlyLastName,
		  meeting, meetingSubject, channelName FROM elderly.meetings JOIN elderly.volunteerusers ON
		   meetings.volunteeruserName = volunteerusers.userName JOIN elderly.elderlyusers ON
		    meetings.elderlyuserName = elderlyusers.userName WHERE volunteerusers.organizationName= '${organizationName}'`);
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
		let elderlyMeetingsInOrganizations = await DButils.execQuery(`SELECT volunteerusers.firstName as volunteerFirstName,
		 volunteerusers.lastName as volunteerLastName, elderlyusers.firstName as elderlyFirstName,elderlyusers.lastName as elderlyLastName,
		  meeting, meetingSubject, channelName FROM elderly.meetings JOIN elderly.volunteerusers ON
		   meetings.volunteeruserName = volunteerusers.userName JOIN elderly.elderlyusers ON
		    meetings.elderlyuserName = elderlyusers.userName WHERE elderlyusers.organizationName= '${organizationName}'`);
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
		organizationName = organizationName.substring(0, organizationName.length - 1);
		let volunteers;
		if (organizationName !== 'NONE') {
			volunteers = await DButils.execQuery(`SELECT * FROM volunteerUsers where organizationName= '${organizationName}'`);
		}
		else{
			volunteers = await DButils.execQuery(`SELECT * FROM volunteerUsers`);
		}

		volunteers = DButils.convertVolunteerDetailsFromDB(volunteers);
		res.send(JSON.stringify(volunteers));
	}
	catch (error) {
		next(error);
	}
});

router.get('/elderlyDetails/:organizationName', async (req, res, next) => {
	try {
		let {organizationName} = req.params;
		organizationName = organizationName.substring(0, organizationName.length - 1);
		let elderlyDetails;

		if (organizationName !== 'NONE') {
			elderlyDetails = await DButils.execQuery(`SELECT * from elderlyUsers WHERE elderlyUsers.organizationName= '${organizationName}'`);
		}
		else {
			elderlyDetails = await DButils.execQuery(`SELECT * from elderlyUsers`);
		}

		elderlyDetails = DButils.convertElderlyDetailsFromDB(elderlyDetails);
		res.send(JSON.stringify(elderlyDetails));
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
		await DButils.execQuery(`DELETE from meetings WHERE meetings.channelName= '${channelName}'`);
		res.status(200).send({message: 'delete succeeded', success: true});
	}
	catch (error) {
		next(error);
	}
});

module.exports = router;


