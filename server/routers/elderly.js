const express = require('express');
const router = express.Router();
const DButils = require('../DButils.js');

router.get('/channels/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let channels = await DButils.getUserChannels(userName);
		console.log(channels);
		res.send(JSON.parse(JSON.stringify(channels)));

	} catch (error) {
		next(error);
	}
});

router.get('/meetings-full-details/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(1, userName.length);
		let meetings = await DButils.getFullMeetingDetails(userName);
		console.log(meetings);
		res.send((meetings));

	} catch (error) {
		next(error);
	}
});

module.exports = router;