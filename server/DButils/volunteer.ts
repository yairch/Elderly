import { Volunteer } from '../types/volunteer';
import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'
import { Gender } from '../types/gender';

export const getVolunteerName = async (username:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const volunteerUsers = db.collection<Volunteer>(collectionIds.volunteerUsers);
		const cursor = await volunteerUsers.find({volunteerUsername:username});
		const res = await cursor.next();
		return{
			firstName: res?.firstName,
			lastName: res?.lastName
		}
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

export const getVolunteerDetails = async (username:string) =>{
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find({volunteerUsername:username});
		let res = await cursor.next();
		return{
			firstName: res?.firstName,
			lastName: res?.lastName,
			email: res?.email
		}
	}
    catch (error){
		console.error(error);
	}
    finally{
		client.close();
	}
}

export const insertVolunteer = async (username:string, firstName:string, lastName:string, birthYear: number, city:string, email:string,  gender:Gender, areasOfInterest:string, languages:string, services:string, preferredDaysAndHours:string, digitalDevices:string, phoneNumber:string, organizationName:string, additionalInformation:string) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const volunteers = db.collection(collectionIds.volunteerUsers);
		volunteers.insertOne({
			username,
			firstName,
			lastName,
			birthYear,
            email,
			city,
			gender,
			areasOfInterest,
			languages,
			services,
			preferredDaysAndHours,
			digitalDevices,
			phoneNumber,
			organizationName,
			additionalInformation			
		});
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

export const getAllVolunteers = async() => {
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find();
		return cursor.toArray();
	}
	catch (error){
		console.error(error);
	}
	finally{
		client.close();
	}
}

export const getVolunteersByOrganization = async(organizationName:string) => {
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find({organizationName: organizationName});
		return cursor.toArray();
	}
    catch (error){
		console.error(error);
	}
    finally{
		client.close();
	}
}
