
import {insertSteps, insertCalories, insertSpeed, insertDistance, insertHR, insertActive, getUpdatedTime} from '../DButils/Bands';
import {insertUser} from '../DButils/user';
import {UserRole} from '../types/user'
import express from 'express';
const router = express.Router();

router.post('/', async(req,res,next)=>{
    try{
        await insertUser(req.body.googleid.givenName, req.body.googleid.givenName, UserRole.Elderly ,"Google" );
        await insertSteps(req.body.featuresWeek.steps, "days",req.body.googleid.googleId)
        await insertCalories(req.body.featuresWeek.calories, "days",req.body.googleid.googleId)
        await insertSpeed(req.body.featuresWeek.speed, "days",req.body.googleid.googleId)
        await insertDistance(req.body.featuresWeek.distance, "days",req.body.googleid.googleId)
        await insertHR(req.body.featuresWeek.hr, "days",req.body.googleid.googleId)
        await insertActive(req.body.featuresWeek.active_min, "days", req.body.googleid.googleId)
        res.status(200).send("Check your DB")
    }catch(e){
        next(e)
    }
});

router.get('/', async(req,res,next)=>{
    try{
        const time = await getUpdatedTime()
        res.status(200).send(time)
    }catch(e){
        next(e)
    }
});


export default router;
