const { responsiblesFields, collectionIds, meetingsCollectionFields, volunteersCollectionFields, elderlyCollectionFields, usersFields, organizationsFields } = require("./constants/collections");

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
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		// creates DB with given name if not already exists
		const dbObject = client.db(config.database.name);
		console.log(`Database was created with name of ${config.database.name}`);  

		return dbObject;
	}
	catch(error) {
		console.error('Database creation failed');
		console.error(error);
	}
	finally {
		client.close();  
	}
	
}

exports.createCollection = async (collectionName) => {
	
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		await db.createCollection(collectionName);
		console.log(`Successfully created collection ${collectionName}`);  
	}
	catch(error) {
		console.error(`Failed creating collection ${collectionName}`);
		console.error(error);
	}
	finally {
		client.close();  
	}
}

// Organization

exports.getOrganizationByName = async (name) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection(collectionIds.organizations);
		const organization = await organizations.findOne({[organizationsFields.name]: name});
		return organization;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getOrganizationByEnglishName = async (englishName) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection(collectionIds.organizations);
		const organization = await organizations.findOne({[organizationsFields.englishName]: englishName});
		return organization;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.insertOrganization = async (name, englishName, type, phoneNumber) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection(collectionIds.organizations);
		await organizations.insertOne({
			[organizationsFields.name]: name,
			[organizationsFields.englishName]: englishName,
			[organizationsFields.type]: type,
			[organizationsFields.phoneNumber]: phoneNumber,
		});		
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getAllOrganizations = async () => {
	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const organizations = db.collection(collectionIds.organizations);
		const cursor = await organizations.find();
		const allOrganizations = await cursor.toArray();
		
		return allOrganizations;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

// User

exports.getUserByUsername = async (username) => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		const user = await users.findOne({[usersFields.username]: username});
		
		return user;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}
exports.updateUserPassword = async (username, password) => {

	const client = new MongoClient(config.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		await users.updateOne({[usersFields.username]: username},
			{
				'$set': {
					[usersFields.password]: password
				}
			})
		
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}
exports.getUsers = async () => {

	const client = new MongoClient(config.database.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		const cursor = await users.find();
		const allUsers = await cursor.toArray();
		
		return allUsers;
	}
	catch(error) {
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getUserChannels = async (userName)=> {
	const client = new MongoClient(config.database.url);
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

exports.insertToUser = async (username, hash_password, userRole, organizationName) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		users.insertOne({
			[usersFields.username]: username,
			[usersFields.password]: hash_password,
			[usersFields.role]: userRole,
			[usersFields.organization]: organizationName
		})
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}



//Meetings
exports.deleteFromMeetings = async(channelName) => {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		meetings.deleteMany({[meetingsCollectionFields.channelName]: channelName});
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getFullMeetingDetails = async (userName)=> {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		meetings.aggregate([
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: collectionIds.meetingsCollectionFields.volunteerUsername,
				  foreignField: volunteersCollectionFields.volunteerUsername,
				  as: 'res'
				}
			}
		]);
		return meetings.toArray();
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getVoluMeetings = async (userName)=> {
	const client = new MongoClient(config.database.url);
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
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		meetings.aggregate([
			{ $lookup:
				{
				  from: collectionIds.elderlyusers,
				  localField: meetingsCollectionFields.volunteerUsername,
				  foreignField: volunteersCollectionFields.volunteerUsername,
				  as: 'res'
				}
			}
		]);
		return meetings.toArray();
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}

exports.getOrganizationMeetings = async (organizationName)=> {
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);
		const meetings = db.collection(collectionIds.meetings);
		const cursor = meetings.aggregate([
			{ $lookup:
				{
				  from: collectionIds.elderlyUsers,
				  localField: meetingsCollectionFields.elderlyUsername,
				  foreignField: elderlyCollectionFields.elderlyUsername,
				  as: 'res'
				}
			},
			{ $lookup:
				{
				  from: collectionIds.volunteerUsers,
				  localField: meetingsCollectionFields.volunteerUsername,
				  foreignField: volunteersCollectionFields.volunteerUsername,
				  as: 'result'
				}
			},
		]).find({[elderlyCollectionFields.organizationName]:organizationName});
		return cursor.toArray();
	}
	catch(error){
		console.error(error);
	}
	finally {
		client.close();  
	}
}


exports.insertToMeetings = async (volunteerUsername, elderlyUsername, meetingDayAndHour, meetingSubject, channelName) =>{
	const client = new MongoClient(config.database.url);
	try{
		await client.connect()

		const db = client.db(config.database.name);

		const meetings = db.collection(collectionIds.meetings);
		let meet = {
			[meetingsCollectionFields.volunteerUsername]: volunteerUsername,
			[meetingsCollectionFields.elderlyUsername]: elderlyUsername,
			[meetingsCollectionFields.meetingDayAndHour]: meetingDayAndHour,
			[meetingsCollectionFields.meetingSubject]: meetingSubject,
			[meetingsCollectionFields.channelName]: channelName,
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
		})
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

	const client = new MongoClient(config.url);
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