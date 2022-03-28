import {MongoClient} from 'mongodb'
const {responsiblesFields, collectionIds, meetingsCollectionFields, volunteersCollectionFields, elderlyCollectionFields, usersFields, organizationsFields } = require("./constants/collections");



//TODO: THIS FILE SHOULD BE EMPTIED AND DELETED WHEN WE FINISH

// volunteer
exports.getVoluName = async (volunteerId) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const volunteerUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volunteerUsers.find({[volunteersCollectionFields.volunteerUsername]:volunteerId});
		const res = cursor.next();
		return{

			firstName: res.firstName,
			lastName: res.lastName
		}
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVolDetails = async (volunteerUsername) =>{
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find({[collectionIds.volunteerUsers.volunteerUsername]: volunteerUsername});
		let res = cursor.next();
		return{
			firstName: res.firstName,
			lastName: res.lastName,
			email: res.email
		}
	}catch (error){
		console.error(error);
	}finally{
		client.close();
	}
}

exports.insertToVol = async (username, firstName, lastName, birthYear, city, email, gender, areasOfInterest, languages, services, preferredDaysAndHours, digitalDevices, phoneNumber, organizationName, additionalInformation) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const volunteers = db.collection(collectionIds.volunteerUsers);
		volunteers.insertOne({
			[volunteersCollectionFields.volunteerUsername]: username,
			[volunteersCollectionFields.firstName]: firstName,
			[volunteersCollectionFields.lastName]: lastName,
			[volunteersCollectionFields.birthYear]: birthYear,
			[volunteersCollectionFields.city]: city,
			[volunteersCollectionFields.email]: email,
			[volunteersCollectionFields.gender]: gender,
			[volunteersCollectionFields.areasOfInterest]: areasOfInterest,
			[volunteersCollectionFields.languages]: languages,
			[volunteersCollectionFields.services]: services,
			[volunteersCollectionFields.preferredDaysAndHours]: preferredDaysAndHours,
			[volunteersCollectionFields.digitalDevices]: digitalDevices,
			[volunteersCollectionFields.phoneNumber]: phoneNumber,
			[volunteersCollectionFields.organizationName]: organizationName,
			[volunteersCollectionFields.additionalInformation]: additionalInformation			
		});
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVols = async() => {
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

exports.getVolsByOrganization = async(organizationName) => {
	const client = new MongoClient(config.database.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find({[volunteersCollectionFields.organizationName]: organizationName});
		return cursor.toArray();
	}catch (error){
		console.error(error);
	}finally{
		client.close();
	}
}

//elderly
exports.insertToEld = async (userName, firstName, lastName, birthYear, city, email, gender,
phoneNumber, areasOfInterest, languages, organizationName, wantedServices, genderToMeetWith, preferredDays,
digitalDevices, additionalInformation, contactName, kinship, contactPhoneNumber, contactEmail) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const elderlies = db.collection(collectionIds.elderlyUsers);
		elderlies.insertOne({
			[elderlyCollectionFields.elderlyUsername]: userName,
			[elderlyCollectionFields.firstName]: firstName,
			[elderlyCollectionFields.lastName]: lastName,
			[elderlyCollectionFields.birthYear]: birthYear,
			[elderlyCollectionFields.city]: city,
			[elderlyCollectionFields.email]: email,
			[elderlyCollectionFields.gender]: gender,
			[elderlyCollectionFields.phoneNumber]: phoneNumber,				
			[elderlyCollectionFields.areasOfInterest]: areasOfInterest,
			[elderlyCollectionFields.languages]: languages,
			[elderlyCollectionFields.organizationName]: organizationName,
			[elderlyCollectionFields.wantedServices]: wantedServices,
			[elderlyCollectionFields.genderToMeetWith]: genderToMeetWith,
			[elderlyCollectionFields.preferredDaysAndHours]: preferredDays,
			[elderlyCollectionFields.digitalDevices]: digitalDevices,
			[elderlyCollectionFields.additionalInformation]: additionalInformation,
			[elderlyCollectionFields.contactName]: contactName,
			[elderlyCollectionFields.kinship]: kinship,
			[elderlyCollectionFields.contactPhoneNumber]: contactPhoneNumber,
			[elderlyCollectionFields.contactEmail]: contactEmail
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
	}catch(error){
		console.error(error);
	}finally{
		client.close();
	}
}
exports.getElderlyDetails = async(organizationName) => {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const elderlies = db.collection(collectionIds.elderlyUsers);
		const cursor = await elderlies.find({[elderlyCollectionFields.organizationName]: organizationName});
		return cursor.toArray();
	}catch(error){
		console.error(error);
	}finally{
		client.close();
	}
}



// Responsible

exports.insertResponsible = async (username, firstName, lastName, email, gender, organization, responsibleType) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const responsibles = db.collection(collectionIds.responsibleUsers);
		
		await responsibles.insertOne({
			[responsiblesFields.username]: username,
			[responsiblesFields.firstName]: firstName,
			[responsiblesFields.lastName]: lastName,
			[responsiblesFields.email]: email,
			[responsiblesFields.gender]: gender,
			[responsiblesFields.organization]: organization,
			[responsiblesFields.responsibleType]: responsibleType
		})
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}