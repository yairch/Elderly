import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Elderly } from "../types/elderly";
import { Meeting } from "../types/meeting";
import { FindOptions, MongoClient } from "mongodb";
import { Projection } from "../constants/mongodbCommands";
import { Gender } from '../types/gender';
import { GenderToMeet } from '../types/genderToMeet';
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
            elderlies.insertOne({
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
    
export const getElderlyUsers = async() => {
    const client = new MongoClient(config.database.url);
    try{
        await client.connect()
        const db = client.db(config.database.name);
        const elderlies = db.collection<Elderly>(collectionIds.elderlyUsers);
        const cursor = elderlies.find();
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
        const cursor = elderlies.find({organizationName: organizationName});
        return cursor.toArray();
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
        const cursor = meetings.find({elderlyUsername: username}, findProjection);
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
    