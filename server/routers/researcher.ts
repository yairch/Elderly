
import {insertSleeping, insertSteps, insertCalories, insertSpeed, insertDistance, insertHR, insertActive, getUpdatedTime, getAllFeatures} from '../DButils/Bands';
import {insertUser} from '../DButils/user';
import {getAllForms} from '../DButils/elderly';
import {UserRole} from '../types/user';
import express from 'express';
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async(req,res,next)=>{
    try{
        //await insertUser(req.body.googleid.givenName, bcrypt.hashSync(req.body.googleid.givenName, 5), UserRole.Elderly ,"Google" );
        await insertSteps(req.body.activityFeatures.steps,req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertCalories(req.body.activityFeatures.calories,req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertSpeed(req.body.activityFeatures.speed,req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertDistance(req.body.activityFeatures.distance,req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertHR(req.body.activityFeatures.hr,req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertActive(req.body.activityFeatures.active_min, req.body.googleid.googleId, req.body.activityFeatures.start, req.body.activityFeatures.end)
        await insertSleeping(req.body.featuresWeek.sleeping, req.body.googleid, req.body.activityFeatures.start, req.body.activityFeatures.end);
        res.status(200).send("Check your DB")
    }catch(e){
        next(e)
    }
});

router.get('/allDailyForms', async(req,res,next)=>{
    const daily = await getAllForms();
    res.status(200).send(daily);
});

router.get('/', async(req,res,next)=>{
    try{
        const time = await getUpdatedTime()
        res.status(200).send(time)
    }catch(e){
        next(e)
    }
});


router.get('/features/:start/:end', async(req,res,next)=>{
    try{
        const {start, end} = req.params;
        const features = await getAllFeatures(new Date(start).getTime(), new Date(end).getTime());
        // console.log(features)
        res.status(200).send(features);
    }catch(e){
        next(e)
    }
});


export default router;
