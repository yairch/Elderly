const { collectionIds, organizationsFields, usersFields, responsiblesFields, meetingsCollectionFields } = require('./constants/collections');
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
	
	const client = new MongoClient(config.url);
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

	const client = new MongoClient(config.url);
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

	const client = new MongoClient(config.url);
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

	const client = new MongoClient(config.url);
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
	const client = new MongoClient(config.url);
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

	const client = new MongoClient(config.url);
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

exports.getUsers = async () => {

	const client = new MongoClient(config.url);
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

exports.insertUser = async (username, password, role, organization) => {

	const client = new MongoClient(config.url);
	try {
		await client.connect()

		const db = client.db(config.database.name);

		const users = db.collection(collectionIds.users);
		
		await users.insertOne({
			[usersFields.username]: username,
			[usersFields.password]: password,
			[usersFields.role]: role,
			[usersFields.organization]: organization,
		})
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