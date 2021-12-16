const express = require('express');
const router = express.Router();
const DButils = require('../DButils.js');
const {notifyElderly} = require('../notifications');

router.get('/meetings/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let meetingsPerElderly = await DButils.execQuery(`SELECT meeting, elderlyuserName, meetingSubject FROM meetings WHERE volunteeruserName= '${userName}'`);
		console.log(meetingsPerElderly);
		res.send(JSON.parse(JSON.stringify(meetingsPerElderly)));

	} catch (error) {
		next(error);
	}
});

router.get('/meetings-full-details/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let meetings = await DButils.execQuery(`SELECT volunteeruserName, meeting, meetingSubject, firstName, lastName
		 FROM elderly.meetings JOIN elderly.elderlyusers ON meetings.elderlyuserName = elderlyusers.userName
		  WHERE volunteeruserName= '${userName}'`);
		console.log(meetings);
		res.send(JSON.parse(JSON.stringify(meetings)));

	} catch (error) {
		next(error);
	}
});

router.post('/notify-elderly', async (req, res, next) => {
		try {
			let {elderlyId, volunteerId, channel, meetingSubject} = req.body;
			let volunteerName = await DButils.execQuery(`SELECT firstName, lastName FROM volunteerUsers WHERE userName= '${volunteerId}'`);
			volunteerName = JSON.parse(JSON.stringify(volunteerName))[0];
			volunteerName = volunteerName.firstName + ' '+ volunteerName.lastName;
			console.log(volunteerName);
			notifyElderly(elderlyId, volunteerName, channel, meetingSubject);
			res.status(200).send({message: 'register to notifications succeeded', success: true});
		}
		catch (error) {
			res.status(500).send({message: error.message, success: false});
		}
	}
);

module.exports = router;