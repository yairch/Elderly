import { collectionIds, meetingsCollectionFields } from './constants/collections';

const {MongoClient} = require('mongodb');

const config = {
	host: 'localhost',
	database: {
		name:'Elderly',
		url:"mongodb://127.0.0.1:27017/"
	},
};

exports.createDatabase = async () => {
	console.log('Tries to create database...')
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		// creates DB with given name if not already exists
		const dbObject = client.db(config.database.name);
		console.log(`Database was created with name of ${config.database.name}`);  

		return dbObject;
	}
	catch(error){
		console.error('Database creation failed');
		console.error(error);
	}
	finally {
		client.close();  
	}
	
}

exports.createCollection = async (collectionName) => {
	
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		await db.createCollection(collectionName);
		console.log(`Successfully created collection ${collectionName}`);  
	}
	catch(error){
		console.error(`Failed creating collection ${collectionName}`);
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getUsers = async () => {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		const cursor = await users.find();
		const allUsers = await cursor.toArray();
		cursor.hasNext()
		cursor.next()
		
		return allUsers;
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getUserChannels = async (userName)=> {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		const cursor = await meetings.find({vo:userName});
		const allColl = await cursor.toArray();
		return allColl;
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getFullMeetingDetails = async (userName)=> {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		meetings.aggregate([
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: 'volunteerUserName',
				  foreignField: 'userName',
				  as: 'res'
				}
			}
		]);
		return res.toArray();
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVoluMeetings = async (userName)=> {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);
		const meetings = db.collection(collectionIds.meetings);
		const cursor = await meetings.find({[meetingsCollectionFields.volunteerUsername] :userName});
		const allColl = await cursor.toArray();
		return allColl;
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getFullVoluMeetings = async (userName)=> {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		meetings.aggregate([
			{ $lookup:
				{
				  from: collectionIds.elderlyusers,
				  localField: meetingsCollectionFields.volunteerUsername,
				  foreignField: 'userName',
				  as: 'res'
				}
			}
		]);
		return res.toArray();
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVoluName = async (volunteerId) => {
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const volunteerUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volunteerUsers.find({"userName":volunteerId});
		res = cursor.next();
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

exports.insertToMeetings = async (volunteerUsername, elderlyUsername, meetingDayAndHour, meetingSubject, channelName) =>{
	const client = new MongoClient(config.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		let meet = {
			"volunteeruserName": volunteerUsername,
			"elderlyuserName": elderlyUsername,
			"meeting": meetingDayAndHour,
			"meetingSubject": meetingSubject,
			"channelName": channelName,
		}
		meetings.insertOne(meet);
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVolDetails = async (volunteerUsername) =>{
	const client = new MongoClient(config.url);
	try{
		const db = client.db(config.database.name);
		const volUsers = db.collection(collectionIds.volunteerUsers);
		const cursor = await volUsers.find({'volunteerUsername': volunteerUsername});
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

/*

const con = new sql.createPool(config);

exports.bcrypt_saltRounds = 13;

exports.execQuery = async function (query) {
	return new Promise(function (resolve, reject) {
		con.query(query, function (err, rows) {
				if (err) {
					console.log(config);
					reject(err);
				}
				if (rows === undefined) {
					reject(new Error('Error rows is undefined'));
				}
				else {
					resolve(rows);
				}
			}
		);
	});
};

exports.convertElderlyDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			phoneNumber: dic.phoneNumber,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			genderToMeetWith: dic.genderToMeetWith,
			wantedServices: JSON.parse(dic.wantedServices),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation
		};
	});
	return records;
};

exports.convertVolunteerDetailsFromDB = function (records) {
	records = records.map((dic) => {
		return {
			userName: dic.userName,
			firstName: dic.firstName,
			lastName: dic.lastName,
			birthYear: dic.birthYear,
			city: dic.city,
			email: dic.email,
			gender: dic.gender,
			phoneNumber: dic.phoneNumber,
			areasOfInterest: JSON.parse(dic.areasOfInterest),
			languages: JSON.parse(dic.languages),
			organizationName: dic.organizationName,
			services: JSON.parse(dic.services),
			preferredDays: JSON.parse(dic.preferredDays),
			digitalDevices: JSON.parse(dic.digitalDevices),
			additionalInformation: dic.additionalInformation
		};
	});
	return records;
};

*/