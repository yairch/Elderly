import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import {elderlyFields} from '../constants/collections'
import { Elderly } from "../types/elderly";
import { Meeting } from "../types/meeting";
import { FindOptions, MongoClient } from "mongodb";
import { Projection } from "../constants/mongodbCommands";
import { Gender } from '../types/gender';
import { GenderToMeet } from '../types/genderToMeet';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// commonjs - JS
// exports.f = ...
// module.exports = router
// const {f} = require('./x')
// //dustructing

//es6 - TS
// export default router
// import* as  router from './/'


export const insertElderly = async (username:string, firstName:string, lastName:string, birthYear:number, city:string, email:string, gender:Gender,
    phoneNumber:string, areasOfInterest:string[], languages:string[], organizationName:string, wantedServices:string[], genderToMeetWith: GenderToMeet, 
    preferredDaysAndHours:string[], digitalDevices:string[], additionalInformation:string, contactName:string, kinship:string, contactPhoneNumber:string, contactEmail:string) => {
        const client = new MongoClient(config.database.url);
        try{
            await client.connect()
            const db = client.db(config.database.name);
            const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
            await elderlies.insertOne({
                username,
                firstName,
                lastName,
                birthYear,
                city,
                email,
                gender,
                phoneNumber,				
                areasOfInterest,
                languages,
                organizationName,
                wantedServices,
                genderToMeetWith,
                preferredDaysAndHours,
                digitalDevices,
                additionalInformation,
                contactName,
                kinship,
                contactPhoneNumber,
                contactEmail
            });
        }
        catch(error){
            console.error(error);
        }
        finally {
            client.close();  
        }
}

export const postDailyForm = async(dailyform:object,userId:number,date:string, googleid:string)=>{
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const formCollection = db.collection(collectionIds.elderlyDailyForms);
        await formCollection.insertOne({
            "answers": dailyform,
            "Uid": userId,
            "Date":date,
            "googleid":googleid
        });
    }
    catch(error){
        console.error(error);
    }
    finally {
        client.close();  
    }
}

export const postInitForm = async(numInitForm:object,catInitForm:object,userId:number,date:string)=>{
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const formCollection = db.collection(collectionIds.elderlyDailyForms);
        await formCollection.insertOne({
            "numeric_answers": numInitForm,
            "categorical_answers":catInitForm,
            "Uid": userId,
            "Date":date
        });
    }
    catch(error){
        console.error(error);
    }
    finally {
        client.close();  
    }
}



 
export const getAllForms = async()=>{
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const daily = db.collection<Elderly>('DailyForms');
        const cursor = await daily.find();
        const allDaily = await cursor.toArray();
        return allDaily;
    }
    catch(error){
        console.error(error);
    }
    finally{
        client.close();
    }
}

    
export const getElderlyUsers = async() => {
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        const cursor = await elderlies.find();
        const allElderly = await cursor.toArray();
        return allElderly;
    }
    catch(error){
        console.error(error);
    }
    finally{
        client.close();
    }
}

export const getElderlyDetails = async(organizationName:string) => {
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        const cursor = await elderlies.find({[elderlyFields.organizationName]: organizationName});
        const result = await cursor.toArray()
        return result
    }
    catch(error){
        console.error(error);
    }
    finally{
        client.close();
    }
}

export const getElderlyChannels = async (username: string): Promise<Pick<Meeting, 'channelName'>[]>=> {
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const meetings = db.collection<Meeting>(collectionIds.meetings);
        const findProjection: FindOptions<Meeting> = {projection: {channelName: Projection.Include}}
        const cursor = await meetings.find({elderlyUsername: username}, findProjection);
        const allChannels: Pick<Meeting, 'channelName'>[] = await cursor.toArray();
        return allChannels;
    }
    catch(error){
        throw(error);
    }
    finally {
        client.close();  
    }
}
    