const express = require('express');
const router = express.Router();
const DButils = require('../DButils.js');
const {notifyElderly} = require('../notifications');

router.get('/meetings/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let meetingsPerElderly = await DButils.volunteeruserName(userName);
		console.log(meetingsPerElderly);
		res.send(meetingsPerElderly);

	} catch (error) {
		next(error);
	}
});

router.get('/meetings-full-details/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let meetings = await DButils.getFullVoluMeetings(userName);
		console.log(meetings);
		res.send(meetings);

	} catch (error) {
		next(error);
	}
});

router.post('/notify-elderly', async (req, res, next) => {
		try {
			let {elderlyId, volunteerId, channel, meetingSubject} = req.body;
			let volunteerName = await DButils.getVoluName(volunteerId);
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