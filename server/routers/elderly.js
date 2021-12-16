const express = require('express');
const router = express.Router();
const DButils = require('../DButils.js');

router.get('/channels/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let channels = await DButils.execQuery(`SELECT channelName, meeting FROM meetings WHERE elderlyuserName= '${userName}'`);
		console.log(channels);
		res.send(JSON.parse(JSON.stringify(channels)));

	} catch (error) {
		next(error);
	}
});

router.get('/meetings-full-details/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let meetings = await DButils.execQuery(`SELECT elderlyuserName, meeting, meetingSubject, firstName, lastName
		 FROM elderly.meetings JOIN elderly.volunteerusers ON meetings.volunteeruserName = volunteerusers.userName
		  WHERE elderlyuserName= '${userName}'`);
		console.log(meetings);
		res.send(JSON.parse(JSON.stringify(meetings)));

	} catch (error) {
		next(error);
	}
});

module.exports = router;