import express from 'express';
import * as volunteerDB from '../DButils/volunteer';
import * as meetingDB from '../DButils/meeting';
import {notifyElderly} from '../notifications'
const router = express.Router();

// get volunteer
router.get('/:username', async (req, res, next) => {
	try {
		const {username} = req.params;
		// username exists
		const volunteer = await volunteerDB.getVolunteerDetails(username);
		console.log(volunteer);
		if (!volunteer) {
			res.status(404).send('volunteer doesn\'t exist');
			return;
		}
		res.status(200).send(JSON.stringify(volunteer));
	}
	catch (error) {
		next(error);
	}
});

// router.get('/meetings/:username', async (req, res, next) => {
// 	try {
// 		const {username} = req.params;
// 		const meetingsVolunteer = await meetingDB.getVolunteerMeetings(username);
// 		console.log(meetingsVolunteer);
// 		res.send(meetingsVolunteer);

// 	} catch (error) {
// 		next(error);
// 	}
// });

router.get('/meetings/:username', async (req, res, next) => {
	try {
		let {username} = req.params;
		console.log(username);
		let meetings = await meetingDB.getFullVolunteerMeetings(username);
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
			let volunteer = await volunteerDB.getVolunteerDetails(volunteerId);
			console.log(volunteer?.firstName, volunteer?.lastName);
			notifyElderly(elderlyId, volunteer?.firstName, volunteer?.lastName, channel, meetingSubject);
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