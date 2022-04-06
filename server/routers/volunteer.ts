import express from 'express';
import * as volunteerDB from '../DButils/volunteer';
import * as meetingDB from '../DButils/meeting';
import {notifyElderly} from '../notifications'
const router = express.Router();

router.get('/meetings/:userName', async (req, res, next) => {
	try {
		const {userName} = req.params;
		const meetingsPerElderly = await meetingDB.getVolunteerMeetings(userName);
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
		let meetings = await meetingDB.getFullVolunteerMeetings(userName);
		console.log(meetings);
		res.send(meetings);
	} 
	catch (error) {
		next(error);
	}
});

router.post('/notify-elderly', async (req, res, next) => {
		try {
			const {elderlyId, volunteerId, channel, meetingSubject} = req.body;
			let volunteerName = await volunteerDB.getVolunteerName(volunteerId);
			// volunteerName = volunteerName?.firstName + ' ' + volunteerName?.lastName;
			console.log(volunteerName);
			notifyElderly(elderlyId, volunteerName?.firstName, volunteerName?.lastName, channel, meetingSubject);
			res.status(200).send({message: 'register to notifications succeeded', success: true});
		}
		catch (error) {
			next(error)
			res.status(500).send({message: "notify elderly didnt succeed", success: false});
		}
	}
);

// router.get('/get-volunteer-services/:userName', async (req, res, next) => {
// 	try {
// 		const {userName} = req.params;
// 		const volunterServices = await volunteerDB.getVolunteerServices(userName);
// 		res.send(volunterServices);

// 	} catch (error) {
// 		next(error);
// 	}
// });

export default router;