import express from 'express';
import * as elderlyDB from '../DButils/elderly';
import * as meetingDB from '../DButils/meeting';
const router = express.Router();

router.get('/channels/:userName', async (req, res, next) => {
	try {
		let {userName} = req.params;
		userName = userName.substring(0, userName.length - 1);
		let channels = await elderlyDB.getElderlyChannels(userName);
		console.log(channels);
		res.send(JSON.parse(JSON.stringify(channels)));

	} catch (error) {
		next(error);
	}
});

router.get('/meetings-full-details/:username', async (req, res, next) => {
	try {
		const {username} = req.params;
		const meetings = await meetingDB.getFullElderlyMeetings(username);
		console.log(meetings);
		res.send((meetings));

	} catch (error) {
		next(error);
	}
});

export default router;