import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Elderly } from "../types/elderly";


exports.insertToEld = async (username:string, firstName:string, lastName:string, birthYear:number, city:string, email:string, gender:Gender,
    phoneNumber:string, areasOfInterest:string, languages:string, organizationName:string, wantedServices:string, genderToMeetWith:string, 
    preferredDaysAndHours:string, digitalDevices:string, additionalInformation:string, contactName:string, kinship:string, contactPhoneNumber:string, contactEmail:string) => {
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
    
    exports.getElderlyUsers = async() => {
        const client = new MongoClient(config.database.url);
        try{
            await client.connect()
    
            const db = client.db(config.database.name);
    
            const elderlies = db.collection(collectionIds.elderlyUsers);
            const cursor = await elderlies.find();
            return cursor.toArray();
        }
        catch(error){
            console.error(error);
        }
        finally{
            client.close();
        }
    }

    exports.getElderlyDetails = async(organizationName:string) => {
        const client = new MongoClient(config.database.url);
        try{
            await client.connect()
    
            const db = client.db(config.database.name);
    
            const elderlies = db.collection(collectionIds.elderlyUsers);
            const cursor = await elderlies.find({organizationName: organizationName});
            return cursor.toArray();
        }
        catch(error){
            console.error(error);
        }
        finally{
            client.close();
        }
    }
    