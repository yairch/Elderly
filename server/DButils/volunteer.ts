import { userFields } from './../constants/collections';
// import { volunteerFields } from './../constants/collections';
import { Volunteer } from '../types/volunteer';
import { MongoClient } from "mongodb";
import { config } from "./config";
import {collectionIds} from '../constants/collectionsIds'

export const getVoluName = async (username:string) => {
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

export const getVolDetails = async (username:string) =>{
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

export const insertToVol = async (username:string, firstName:string, lastName:string, birthYear:string, email:string, city:string, gender:Gender, areasOfInterest:string, languages:string, services:string, preferredDaysAndHours:string, digitalDevices:string, phoneNumber:string, organizationName:string, additionalInformation:string) => {
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

export const getVols = async() => {
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find();
		return cursor.toArray();
	}catch (error){
		console.error(error);
	}finally{
		client.close();
	}
}

export const getVolsByOrganization = async(organizationName:string) => {
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
