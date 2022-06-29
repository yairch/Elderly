import express from 'express';
import * as elderlyDB from '../DButils/elderly';
import * as meetingDB from '../DButils/meeting';
// import * as formDB from '../DButils/dailyForm'
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

router.get('/elderly/daily-form/:username', async (req, res, next) => {
	try {
		const {username} = req.params;
		const meetings = await meetingDB.getFullElderlyMeetings(username);
		console.log(meetings);
		res.send((meetings));

	} catch (error) {
		next(error);
	}
});

router.post('/daily-form', async (req, res, next) => {
	try {
		const {formAnswer,userId,date,googleid} = req.body;
		let elderlyName = await elderlyDB.postDailyForm(formAnswer,userId,date, googleid);
		// volunteerName = volunteerName?.firstName + ' ' + volunteerName?.lastName;
		console.log(elderlyName);
		res.status(200).send({message: 'register to notifications succeeded', success: true});
	}
	catch (error) {
		next(error)
		res.status(500).send({message: "notify elderly didnt succeed", success: false});
	}
}
);

router.post('/init-form', async (req, res, next) => {
	try {
		const {numericformAnswer,categoricalformAnswer,userId,date} = req.body;
		let elderlyName = await elderlyDB.postInitForm(numericformAnswer,categoricalformAnswer,userId,date);
		// volunteerName = volunteerName?.firstName + ' ' + volunteerName?.lastName;
		console.log(elderlyName);
		res.status(200).send({message: 'register to notifications succeeded', success: true});
	}
	catch (error) {
		next(error)
		res.status(500).send({message: "notify elderly didnt succeed", success: false});
	}
}
);

// router.get('/init-form',async(req,res,next)=>{
// 	try{
// 		const form = await initFormDB.GetDailyForm()
// 	} catch (error){
// 		next(error)
// 	}
// });
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